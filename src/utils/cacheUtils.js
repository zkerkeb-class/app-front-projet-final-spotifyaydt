class CacheManager {
  constructor(
    ttl = parseInt(process.env.REACT_APP_CACHE_TTL) || 5 * 60 * 1000
  ) {
    // 5 minutes default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  set(key, value) {
    const expiry = Date.now() + this.ttl;
    this.cache.set(key, { value, expiry });
  }

  clear() {
    this.cache.clear();
  }
}

export const cacheManager = new CacheManager();

export const fetchWithCache = async (url, options = {}) => {
  const cacheKey = url;
  const cachedData = cacheManager.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const response = await fetch(url, options);
  const data = await response.json();
  cacheManager.set(cacheKey, data);
  return data;
};
