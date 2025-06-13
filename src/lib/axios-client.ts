import axios from "axios";

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.hikvisionkenyashop.com/api/",
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

export default API;
