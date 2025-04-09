import { cacheManager } from '../utils/cacheUtils';

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  'https://back-end-projet-final-spotifyaydt.onrender.com/api';

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
  constructor(message, status, code, details = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

class NetworkError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'NetworkError';
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

// Enhanced error logging
const logError = (error, context = {}) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    type: error.name,
    message: error.message,
    ...context,
    ...(error.details || {}),
  };
  console.error('API Error:', errorLog);
};

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

async function fetchWithRetry(url, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Only add CSRF token for mutation requests
  const method = options.method || 'GET';
  if (method !== 'GET' && method !== 'HEAD') {
    const csrfToken = document.querySelector(
      'meta[name="csrf-token"]'
    )?.content;
    if (csrfToken) {
      defaultHeaders['X-CSRF-Token'] = csrfToken;
    }
  }

  const fetchOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'Request failed',
        response.status,
        errorData.code,
        {
          url,
          method: options.method || 'GET',
        }
      );
    }

    const data = await response.json();
    return validateResponse(data);
  } catch (error) {
    if (error.name === 'TypeError') {
      const networkError = new NetworkError('Network error occurred', {
        url,
        method: options.method || 'GET',
      });
      logError(networkError);
      throw networkError;
    }

    logError(error);
    throw error;
  }
}

async function fetchWithCache(url, options = {}) {
  const cacheKey = `${options.method || 'GET'}-${url}`;

  // Only use cache for GET requests
  if (options.method === 'GET' || !options.method) {
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  try {
    const data = await fetchWithRetry(url, options);

    // Only cache GET requests
    if (options.method === 'GET' || !options.method) {
      cacheManager.set(cacheKey, data);
    }

    return data;
  } catch (error) {
    logError(error, { url, method: options.method || 'GET' });
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
    create: async (data) => {
      return await fetchWithCache(`${BASE_URL}${ENDPOINTS.PLAYLISTS}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id, data) => {
      return await fetchWithCache(`${BASE_URL}${ENDPOINTS.PLAYLISTS}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete: async (id) => {
      return await fetchWithCache(`${BASE_URL}${ENDPOINTS.PLAYLISTS}/${id}`, {
        method: 'DELETE',
      });
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
