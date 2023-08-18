import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/stores/auth";

// The backend api
const myApi: AxiosInstance = axios.create({
//   baseURL: process.env.VUE_APP_API_URL,
  baseURL: "http://localhost:3000",
	headers: {
    'Content-type': 'application/json'
	},
	withCredentials: undefined
});

myApi.interceptors.request.use(config => {
	if (useAuthStore().needsRefresh){
		console.log("Sono in refresh")
		config.headers['Authorization'] = useAuthStore().refreshBearer;
	}
	else
	{
		console.log("Non sono in refresh")
		config.headers['Authorization'] = useAuthStore().tokenBearer;
	}
	return config;
  });

export const refreshAccessTokenFn = async () => {
	try {	  
		const response = await myApi.post('/auth/refresh');
  
		// Handle the response and update the access token
		useAuthStore().token = response.data.accessToken;
		useAuthStore().refreshToken = response.data.refreshToken;
		useAuthStore().needsRefresh = false;
		console.log("Refreshed access token:", response.data.accessToken);
	} catch (error) {
		// Handle error
		console.error("Error refreshing access token:", error);
	}
  };  
  
  myApi.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		
		const originalRequest = error.config;
		const errMessage = error.response.data.message as string;
		console.log("Ciao non funziono!", errMessage)
		if (errMessage.includes('Unauthorized') && !originalRequest._retry) {
			console.log("Ciao non funziono mai!")
			useAuthStore().needsRefresh = true;
			console.log("Token is ", useAuthStore().needsRefresh)
			console.log("Token refresh is ", useAuthStore().tokenBearer)
			console.log("Token access is ", useAuthStore().refreshBearer)
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