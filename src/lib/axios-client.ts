import axios from "axios";

const options = {
  baseURL: "http://164.92.217.115:4500/api/",
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

export default API;
