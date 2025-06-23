import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // backend server URL //baseURL: "http://ec2-23-22-165-228.compute-1.amazonaws.com:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
