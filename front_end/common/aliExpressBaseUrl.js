import axios from "axios";

const ApiInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // your Django backend URL
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Attach access token to every request
ApiInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem("aliexpress_access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// Handle 401 responses and refresh token
ApiInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return ApiInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("aliexpress_refresh_token");
        const response = await axios.post("http://127.0.0.1:8000/api/aliexpress/refresh-token/", { refresh_token: refreshToken });

        if (response.data.success) {
          const { access_token, refresh_token } = response.data;
          localStorage.setItem("aliexpress_access_token", access_token);
          localStorage.setItem("aliexpress_refresh_token", refresh_token);

          ApiInstance.defaults.headers.Authorization = `Bearer ${access_token}`;
          processQueue(null, access_token);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return ApiInstance(originalRequest);
        } else {
          processQueue(response.data.error || "Refresh failed", null);
          return Promise.reject(response.data.error || "Refresh failed");
        }
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("aliexpress_access_token");
        localStorage.removeItem("aliexpress_refresh_token");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default ApiInstance;
