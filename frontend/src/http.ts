import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/stores/auth";

// The backend api
const myApi: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
	headers: {
    'Content-type': 'application/json'
	},
	withCredentials: undefined
});

myApi.interceptors.request.use( config => {
	config.headers!['Authorization'] = useAuthStore().tokenBearer;
	return config;
});
		
export default myApi