import axios from "axios";

const baseAxios = axios.create({
   baseURL: import.meta.env.VITE_BASEURL,
   withCredentials: true,
});

export default baseAxios;