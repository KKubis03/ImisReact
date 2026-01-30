import axios from "axios";
import { API_ENDPOINT } from "../config/api.config";

const axiosClient = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
