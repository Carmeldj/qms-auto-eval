import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 5000,
});

// Request interceptor to add the token to each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh and network errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If it's a network error (API not available), silently reject
    if (!error.response && error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.warn('API backend not available, skipping request');
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshResponse.data;

        // Store the new access token
        localStorage.setItem("accessToken", accessToken);

        // Update the authorization header
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
