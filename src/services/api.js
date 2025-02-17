import { cacheManager } from '../utils/cacheUtils';

const BASE_URL = 'https://back-end-projet-final-spotifyaydt.onrender.com/api';

const ENDPOINTS = {
  PLAYLISTS: '/playlists',
  TRACKS: '/tracks',
  ALBUMS: '/albums',
  ARTISTS: '/artists',
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      await sleep(RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
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

  const data = await fetchWithRetry(url, options);
  cacheManager.set(cacheKey, data);
  return data;
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
