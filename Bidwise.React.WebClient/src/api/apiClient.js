import axios from "axios";

export const ApiClient = axios.create({
  headers: {
    "X-CSRF": 1,
  },
});
