import { cacheManager } from '../utils/cacheUtils';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ENDPOINTS = {
  PLAYLISTS: '/playlists',
  TRACKS: '/tracks',
  ALBUMS: '/albums',
  ARTISTS: '/artists',
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const CSRF_HEADER = 'X-CSRF-Token';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Error types for better error handling
class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

// Get CSRF token from meta tag
const getCSRFToken = () => {
  const token = document.querySelector('meta[name="csrf-token"]')?.content;
  return token || localStorage.getItem('csrfToken');
};

// Validate response data
const validateResponse = (data) => {
  if (!data)
    throw new ApiError('Invalid response data', 500, 'INVALID_RESPONSE');
  return data;
};

async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
  const csrfToken = getCSRFToken();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (csrfToken) {
    defaultHeaders[CSRF_HEADER] = csrfToken;
  }

  const fetchOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Include cookies in requests
  };

  try {
    const response = await fetch(url, fetchOptions);

    // Store CSRF token if provided in response
    const newToken = response.headers.get(CSRF_HEADER);
    if (newToken) {
      localStorage.setItem('csrfToken', newToken);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'Request failed',
        response.status,
        errorData.code
      );
    }

    const data = await response.json();
    return validateResponse(data);
  } catch (error) {
    if (error instanceof ApiError) {
      // Don't retry on client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
    }

    if (retries > 0) {
      await sleep(RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }

    if (error.name === 'TypeError' || error.name === 'NetworkError') {
      throw new NetworkError('Network error occurred');
    }
    throw error;
  }
}

async function fetchWithCache(url, options = {}) {
  const cacheKey = url;
  const cachedData = cacheManager.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const data = await fetchWithRetry(url, options);
    cacheManager.set(cacheKey, data);
    return data;
  } catch (error) {
    // Log error for monitoring
    console.error('API Error:', {
      url,
      error: error.message,
      code: error.code,
      status: error.status,
    });
    throw error;
  }
}

export const api = {
  playlists: {
    getAll: async () => {
      return await fetchWithCache(`${BASE_URL}${ENDPOINTS.PLAYLISTS}`);
    },
    getById: async (id) => {
      return await fetchWithCache(`${BASE_URL}${ENDPOINTS.PLAYLISTS}/${id}`);
    },
  },
  tracks: {
    getAll: async () => {
      return await fetchWithCache(`${BASE_URL}${ENDPOINTS.TRACKS}`);
    },
    getById: async (id) => {
      return await fetchWithCache(`${BASE_URL}${ENDPOINTS.TRACKS}/${id}`);
    },
  },
  albums: {
    getAll: async () => {
      return await fetchWithCache(`${BASE_URL}${ENDPOINTS.ALBUMS}`);
    },
    getById: async (id) => {
      return await fetchWithCache(`${BASE_URL}${ENDPOINTS.ALBUMS}/${id}`);
    },
  },
  artists: {
    getAll: async () => {
      return await fetchWithCache(`${BASE_URL}${ENDPOINTS.ARTISTS}`);
    },
    getById: async (id) => {
      return await fetchWithCache(`${BASE_URL}${ENDPOINTS.ARTISTS}/${id}`);
    },
  },
};
