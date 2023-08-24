import http from '@/http';
import { type ISignedIn } from '@/models/ISignedIn';
// import { IUser } from '@/models/IUser';

class AuthService {
  // local
  signInLocal(email: string, password: string, isEmail: boolean) {
    if (isEmail)
      return http.post('/auth/local/signin', { email: email, password });
    else
      return http.post('/auth/local/signin', { username: email, password });
    // return http.post('/auth/local/signin', { email, password });
  }
  signUpLocal(email: string, username:string, password: string) {
    return http.post<ISignedIn>('/auth/local/signup', { email, username, password });
  }
    /* --------------------------- for the jwt decode --------------------------- */
  decodePayload(token: string) {
	const payloadBase64Url = token.split('.')[1];
	const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
	const payloadJson = atob(payloadBase64);
	// const tokData = JSON.parse(payloadJson);
	// id = tokData.id;
	// console.log("id", id);
	return JSON.parse(payloadJson);
  }
  // Google
  // signInGoogle(params: string) {
  //   return http.get<ISignedIn>(`/auth/google/signin${params}`, {
  //     headers: {},
  //     withCredentials: false,
  //   });
  // }
  // signUpGoogle(params: string) {
  //   return http.get<ISignedIn>(`/auth/google/signup${params}`, {
  //     headers: {},
  //     withCredentials: false,
  //   });
  // }

  
  // 42
  signInFortyTwo(params: string) {
    return http.get<ISignedIn>(`/auth/42/signin${params}`, {
    });
  }
  //   signInFortyTwo(params: string) {
  //   return http.get<ISignedIn>(`/auth/42/signin${params}`, {
  //     headers: {},
  //     withCredentials: false,
  //   });
  // }
  // signUpFortyTwo(params: string) {
  //   return http.get<ISignedIn>(`/auth/42/signup${params}`, {
  //     headers: {},
  //     withCredentials: false,
  //   });
  // }

	/* Two Factor Auth:  */

	// async generateQrCode() {
	// 	const response = await http.post('/2fa/generate', {}, { responseType : 'blob'});
	// 	const fileUrl = window.URL.createObjectURL(response.data);
	// 	return fileUrl;
	// }

	// turnOnTwoFA(twoFaCode : string) {
	// 	return http.post('/2fa/turn-on', { twoFaCode : twoFaCode });
	// }

	// authenticateTwoFA(twoFaCode : string) {
	// 	return http.post('/2fa/authenticate', { twoFaCode : twoFaCode });
	// }

  /** Get a new access_token. Must provide the refresh token */
  async refresh() {
    const response = await http.post('/auth/refresh');
	return response.data;
  }
  /** Will delete refresh token from db */
  logout() {
    return http.post('/auth/logout');
  }
  deleteAccount() {
    return http.delete('/users');
  }
}
export default new AuthService();
