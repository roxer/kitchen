import axios from "axios";
import { router } from "@/router";
import { useSessionStore } from "@/stores/sessionStore";

// Configure axios to send credentials (cookies) with requests
axios.defaults.withCredentials = true;

// Set default content type to application/json
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// Response interceptor to handle 401 unauthorized responses
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const sessionStore = useSessionStore.getState();

      // Clear the user from store
      sessionStore.clearSession();

      // Redirect to login page if not already there
      if (window.location.hash !== "#/login") {
        router.navigate("/login");
      }
    }

    return Promise.reject(error);
  }
);
