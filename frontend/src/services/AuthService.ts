import http from '@/http';
import { type ISignedIn } from '@/models/ISignedIn';

class AuthService {
  // local
  signInLocal(email: string, password: string, isEmail: boolean) {
    if (isEmail)
      return http.post('/auth/local/signin', { email: email, password });
    else
      return http.post('/auth/local/signin', { username: email, password });
  }
  signUpLocal(email: string, username:string, password: string) {
    return http.post<ISignedIn>('/auth/local/signup', { email, username, password });
  }
    /* --------------------------- for the jwt decode --------------------------- */
  decodePayload(token: string) {
	const payloadBase64Url = token.split('.')[1];
	const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
	const payloadJson = atob(payloadBase64);
	return JSON.parse(payloadJson);
  }

  // 42
  signInFortyTwo(params: string) {
    return http.get<ISignedIn>(`/auth/42/signin${params}`, {
    });
  }

  signInLocal2fa(emailcode: string, email: string, isEmail: boolean) {
    if (isEmail)
      return http.post('/auth/local/signin/2fa', {verificationCode: emailcode, email: email});
    else
      return http.post('/auth/local/signin/2fa', { verificationCode: emailcode, username: email });
  }

  change2fa() {
    return http.post('/user/change2fa');
  }

  online() {
    return http.post('/user/online');
  }

  offline() {
    return http.post('/user/offline');
  }

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
