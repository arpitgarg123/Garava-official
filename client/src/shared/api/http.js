import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL || "http://localhost:8080/api").replace(/\/+$/, "");

// Create HTTP clients with reasonable timeouts
const http = axios.create({ 
  baseURL, 
  withCredentials: true, 
  timeout: 8000 // 8 seconds for regular requests
});

// Auth requests can be slightly longer but not 30s
const authHttp = axios.create({ 
  baseURL, 
  withCredentials: true, 
  timeout: 12000 // 12 seconds for auth requests
});

// Utility function for exponential backoff retry
const retryRequest = async (requestFn, maxRetries = 2, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain error types
      if (error.response?.status === 401 || 
          error.response?.status === 403 || 
          error.response?.status === 422 ||
          attempt > maxRetries) {
        throw error;
      }
      
      // Only retry on network errors or 5xx server errors
      const isRetryableError = error.code === 'ECONNABORTED' || 
                               error.code === 'NETWORK_ERROR' ||
                               (error.response?.status >= 500);
      
      if (!isRetryableError) {
        throw error;
      }
      
      // Exponential backoff delay
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Request failed (attempt ${attempt}), retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
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
  console.log('HTTP Request:', {
    url: config.url,
    method: config.method?.toUpperCase(),
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
  });
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!original || original._retry) return Promise.reject(error);

    if (error.response?.status === 401) {
      console.log('HTTP Interceptor - 401 Unauthorized detected:', original.url);
      
      // If this is already a logout request, don't try to refresh
      if (original.url?.includes('/auth/logout')) {
        console.log('HTTP Interceptor - Logout request failed, clearing auth state');
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

      try {
        console.log('HTTP Interceptor - Attempting token refresh...');
        const { data } = await authHttp.post('/auth/refresh', {});
        const newToken = data?.accessToken;
        
        console.log('HTTP Interceptor - Refresh response:', { 
          success: data?.success, 
          hasToken: !!newToken, 
          hasUser: !!data?.user 
        });
        
        if (!newToken) {
          console.error('HTTP Interceptor - No token received from refresh');
          throw new Error('No token received from refresh');
        }
        
        console.log('HTTP Interceptor - Token refresh successful');
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