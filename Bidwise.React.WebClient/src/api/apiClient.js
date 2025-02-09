import axios from "axios";

export const ApiClient = axios.create({
  baseURL: "/",
  headers: {
    "X-CSRF": 1,
  },
});

ApiClient.interceptors.response.use((res) => res.data);
