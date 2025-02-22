import axios from "axios";
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST,
  headers: {
    "content-type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("token");

    if (!accessToken) return config;

    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (err) => Promise.reject(err)
);
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      (error.response && error.response.status === "username_is_not_existed")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
