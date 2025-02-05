import axios from "axios";

const options = {
  baseURL: "https://hickdigitalmart-backend.onrender.com/api/",
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

export default API;
