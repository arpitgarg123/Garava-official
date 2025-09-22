import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/+$/, "");
const http = axios.create({ baseURL, withCredentials: true, timeout: 10000 });

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

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!original || original._retry) return Promise.reject(error);

    if (error.response?.status === 401) {
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
        const { data } = await axios.post(`${baseURL}/api/auth/refresh`, {}, { withCredentials: true });
        const newToken = data?.accessToken;
        setTokenCb(newToken);
        flushQueue(null, newToken);
        if (newToken) original.headers.Authorization = `Bearer ${newToken}`;
        return http(original);
      } catch (err) {
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

export default http;