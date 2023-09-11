import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/stores/auth";

// The backend api
const myApi: AxiosInstance = axios.create({
	baseURL: "/api",
	headers: {
    'Content-type': 'application/json'
	},
	withCredentials: undefined
});

myApi.interceptors.request.use(config => {
	if (useAuthStore().needsRefresh)
		config.headers['Authorization'] = useAuthStore().refreshBearer;
	else
		config.headers['Authorization'] = useAuthStore().tokenBearer;
	return config;
  });

export const refreshAccessTokenFn = async () => {
	try {	  
		const response = await myApi.post('/auth/refresh');
  
		// Handle the response and update the access token
		useAuthStore().token = response.data.accessToken;
		useAuthStore().refreshToken = response.data.refreshToken;
		useAuthStore().needsRefresh = false;
	} catch (e) {
		// Handle error
		if (e)
			console.error("Error refreshing access token:", e);
	}
  };  
  
  myApi.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		if (!error.response) {
			return ;
		}

		const originalRequest = error.config;
		const errMessage = error.response.data.message as string;
		if (errMessage.includes('Unauthorized') && !originalRequest._retry) {
			useAuthStore().needsRefresh = true;
		originalRequest._retry = true;
		await refreshAccessTokenFn();
		return myApi(originalRequest);
		}
		if (errMessage.includes('Access Denied') && !originalRequest._retry) {
			useAuthStore().logout;
		}
		return Promise.reject(error);
	}
  );	
export default myApi
