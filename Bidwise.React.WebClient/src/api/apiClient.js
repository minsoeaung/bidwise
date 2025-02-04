import axios from "axios";

export const ApiClient = axios.create({
  baseURL: import.meta.env.VITE_ROOT_URL,
  withCredentials: true,
  headers: {
    "X-CSRF": 1,
  },
});
