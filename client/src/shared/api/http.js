import axios from "axios";
import { getAccessToken, setAccessToken } from '../auth';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 10000, 
})
http.interceptors.request.use((config) =>{
      const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config
})

let refreshing = null
http.interceptors.response.use((res) => res, async (err) =>{
  const { response, config } = err;
  if (response?.status === 401 && !config._retry){
    config._retry = true;
      refreshing = refreshing ?? refresh();
      const newToken = await refreshing.finally(() => (refreshing = null));
       if (newToken) {
        setAccessToken(newToken);
        config.headers.Authorization = `Bearer ${newToken}`;
        return http(config);
      }
  }
   return Promise.reject(err);
})
export default http;