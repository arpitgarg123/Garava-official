import axios from "axios";

// Use Vite runtime env: import.meta.env.VITE_API_URL. Fallback to localhost for dev.
const baseURL = (import.meta.env?.VITE_API_URL || "http://localhost:8080/api").replace(/\/+$/,
  "")

// Create HTTP clients with reasonable timeouts
const http = axios.create({ 
  baseURL, 
  withCredentials: true, 
  timeout: 8000, // 8 seconds for regular requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth requests can be slightly longer but not 30s
const authHttp = axios.create({ 
  baseURL, 
  withCredentials: true, 
  timeout: 12000, // 12 seconds for auth requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Utility function for exponential backoff retry with circuit breaker
let failureCount = 0;
let lastFailureTime = 0;
const CIRCUIT_BREAKER_THRESHOLD = 5;
const CIRCUIT_BREAKER_TIMEOUT = 60000; // 1 minute

const retryRequest = async (requestFn, maxRetries = 1, baseDelay = 2000) => {
  // Circuit breaker check
  const now = Date.now();
  if (failureCount >= CIRCUIT_BREAKER_THRESHOLD && 
      (now - lastFailureTime) < CIRCUIT_BREAKER_TIMEOUT) {
    throw new Error('Circuit breaker open - too many recent failures');
  }
  
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const result = await requestFn();
      // Reset failure count on success
      failureCount = 0;
      return result;
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain error types
      if (error.response?.status === 401 || 
          error.response?.status === 403 || 
          error.response?.status === 422 ||
          error.response?.status === 404 ||
          attempt > maxRetries) {
        failureCount++;
        lastFailureTime = now;
        throw error;
      }
      
      // Only retry on network errors or 5xx server errors
      const isRetryableError = error.code === 'ECONNABORTED' || 
                               error.code === 'NETWORK_ERROR' ||
                               error.message?.includes('timeout') ||
                               (error.response?.status >= 500);
      
      if (!isRetryableError) {
        failureCount++;
        lastFailureTime = now;
        throw error;
      }
      
      // Exponential backoff delay with jitter
      const jitter = Math.random() * 1000; // Add random delay up to 1s
      const delay = baseDelay * Math.pow(1.5, attempt - 1) + jitter; // Use 1.5x instead of 2x
      await new Promise(resolve => setTimeout(resolve, Math.min(delay, 8000))); // Cap at 8s
    }
  }
  
  failureCount++;
  lastFailureTime = now;
  throw lastError;
};

// Bindings provided at app bootstrap (avoid importing the store here)
let getToken = () => null;
let setTokenCb = () => {};
let logoutCb = () => {};

export function bindAuth({ getToken: g, setToken: s, logout: l }) {
  if (g) getToken = g;
  if (s) setTokenCb = s;
  if (l) logoutCb = l;
}

let isRefreshing = false;
let queue = [];
const flushQueue = (error, token = null) => {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  queue = [];
};

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Add similar interceptors for authHttp
authHttp.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

authHttp.interceptors.response.use(
  (res) => res,
  async (error) => {
    console.error('AuthHttp Response Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

// Auth refresh tracking
let refreshAttempts = 0;
let lastRefreshAttempt = 0;
const MAX_REFRESH_ATTEMPTS = 2;
const REFRESH_COOLDOWN = 5000; // 5 seconds between refresh attempts

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    
    // Handle blocked requests (ad blockers, etc.)
    if (error.message === 'Network Error' || error.code === 'ERR_BLOCKED_BY_CLIENT') {
      console.warn('Request blocked by client (possibly ad blocker):', original?.url);
      // You could implement retry logic or show a user-friendly message
      error.isBlocked = true;
    }
    
    if (!original || original._retry) return Promise.reject(error);

    if (error.response?.status === 401) {
      // If this is already a logout or refresh request, don't try to refresh
      if (original.url?.includes('/auth/logout') || original.url?.includes('/auth/refresh')) {
        logoutCb();
        return Promise.reject(error);
      }
      
      // Check refresh cooldown and attempt limits
      const now = Date.now();
      if (refreshAttempts >= MAX_REFRESH_ATTEMPTS || 
          (now - lastRefreshAttempt) < REFRESH_COOLDOWN) {
        logoutCb();
        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: (token) => {
              if (token) original.headers.Authorization = `Bearer ${token}`;
              resolve(http(original));
            },
            reject,
          });
        });
      }

      original._retry = true;
      isRefreshing = true;
      refreshAttempts++;
      lastRefreshAttempt = now;

      try {
        const { data } = await authHttp.post('/auth/refresh', {});
        const newToken = data?.accessToken;
        
        if (!newToken) {
          console.error('HTTP Interceptor - No token received from refresh');
          throw new Error('No token received from refresh');
        }
        
        // Reset refresh attempts on successful refresh
        refreshAttempts = 0;
        setTokenCb(newToken);
        flushQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return http(original);
      } catch (err) {
        console.error('HTTP Interceptor - Token refresh failed:', err.response?.status, err.response?.data?.message || err.message);
        flushQueue(err, null);
        logoutCb();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Export both HTTP clients and utility functions
export default http;
export { authHttp, retryRequest };