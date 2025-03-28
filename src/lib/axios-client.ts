import axios from "axios";

const options = {
  baseURL: "https://api.hikvisionkenyashop.com/api/",
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

export default API;
