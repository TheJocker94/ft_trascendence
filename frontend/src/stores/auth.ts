import { defineStore } from 'pinia';
import api from '@/services/AuthService';
import { useCurrentUserStore } from '@/stores/currentUser';
import { useLocalStorage } from '@vueuse/core';
import type { IError } from '@/models/IError';
import axios, { AxiosError } from 'axios';
import AuthService from '@/services/AuthService';
import router from '@/router';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', {
  state: () => ({
      token: useLocalStorage('token', ''),
      refreshToken: useLocalStorage('refreshToken', ''),
      needsRefresh: false,
      hasGameInvite: ref(false),
      twoFaEnabled:useLocalStorage('twoFaEnabled', false),
      twofa: ref(''),
    }),
    getters: {

    isLoggedIn() {
      if (this.token === '')
				return false;
			return true;
		},
    tokenBearer(): string {
      return this.token === '' ? '' : 'Bearer ' + this.token;
    },
    refreshBearer(): string {
      return this.refreshToken === '' ? '' : 'Bearer ' + this.refreshToken;
    },
  },
  actions: {
    // local
    async signInLocal (
      email: string,
      password: string,
      isEmail: boolean,
    ): Promise<IError | undefined | boolean> {
      try {
        const resp = await api.signInLocal(email, password, isEmail);
        if (resp.data.is2faEnabled)
          return true;
        const tokData = api.decodePayload(resp.data.tokens.accessToken);
        this.setState(resp.data.tokens.accessToken, resp.data.tokens.refreshToken, resp.data.tokens.is2faEnabled);
		await useCurrentUserStore().initStore(tokData.id, tokData.email);
        router.push('/users/' + useCurrentUserStore().userId);
  } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },

    async signInLocal2fa (emailcode: string, email: string, isEmail: boolean
    ): Promise<IError | undefined> {
      try {
        const resp = await api.signInLocal2fa(emailcode, email, isEmail);
        const tokData = api.decodePayload(resp.data.accessToken);
        this.setState(resp.data.accessToken, resp.data.refreshToken, true);
		await useCurrentUserStore().initStore(tokData.id, tokData.email);
        router.push('/users/' + useCurrentUserStore().userId);
  } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },

    async change2fa(): Promise<IError | undefined> {
      try {
        const resp = await api.change2fa();
        this.twoFaEnabled = resp.data;
  } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
  },

    async signUpLocal(email: string, username:string, password: string){
      try {
        const resp = await api.signUpLocal(email, username, password);
        const tokData = api.decodePayload(resp.data.accessToken);
        this.setState(resp.data.accessToken, resp.data.refreshToken, false);
		await useCurrentUserStore().initStore(tokData.id, tokData.email);
        router.push('/users/' + useCurrentUserStore().userId);
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },
    async renewToken() {
      try {
        const response = await AuthService.refresh() // Make sure you have an API method to renew the token
        const newAccessToken = response.data.access_token;
        this.token = newAccessToken;
      } catch (err) {
        console.error('Error renewing token:', err);
      }
    },
    
    // 42
    async signInFortyTwo(accessToken: string, refreshToken: string): Promise<IError | undefined> {
      try {
      const tokData = api.decodePayload(accessToken);
      // inserire 2fa value della 42
      this.setState(accessToken, refreshToken, false);
      await useCurrentUserStore().initStore(tokData.id, tokData.email);
      router.push('/users/' + useCurrentUserStore().userId);
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },

	async initStoreasync(){
		if (this.token)
      await useCurrentUserStore().initStore(null, null);
    },

    setState(token: string, refreshToken: string, is2faEnabled: boolean){
      this.token = token;
      this.refreshToken = refreshToken;
      this.twoFaEnabled = is2faEnabled;
    },

    logout(){
      api.logout().finally(() => {
        this.clearApp();
      });
    },
    async deleteAccount(){
      await api.deleteAccount(); // deal the response or balec ?
      this.clearApp();
    },
    clearApp(){
      localStorage.clear();
      this.token = '';
      this.refreshToken = '';
      useCurrentUserStore().$reset();
    }
  },
});
