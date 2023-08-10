import { defineStore } from 'pinia';
import api from '@/services/AuthService';
import { useCurrentUserStore } from '@/stores/currentUser';
import { useLocalStorage } from '@vueuse/core';

import type { IError } from '@/models/IError';
import axios, { AxiosError } from 'axios';


export const useAuthStore = defineStore('auth', {
  state: () => ({
      token: useLocalStorage('token', ''),
      refreshToken: useLocalStorage('refreshToken', ''),
      registerInProgress: useLocalStorage('registerInProgress', false),
    }),
    getters: {

    isLoggedIn() {
      if (this.registerInProgress || this.token === '')
				return false;
			// if (state.twoFaEnabled && !state.twoFaAuthenticated)
			// 	return false;
			return true;
		},
    tokenBearer(): string {
      return this.token === '' ? '' : 'Bearer ' + this.token;
    },
  },
  actions: {
    // local
    async signInLocal (
      email: string,
      password: string,
    ): Promise<IError | undefined> {
      try {
        const resp = await api.signInLocal(email, password);
        const tokData = api.decodePayload(resp.data.accessToken);
        console.log(resp.data.accessToken);
        console.log(resp.data.refreshToken);

        this.setState(resp.data.accessToken, resp.data.refreshToken);
        console.log("token saved is", this.token)
				// this.twoFaEnabled = resp.data.twoFaEnabled;
				// if (!this.twoFaEnabled)
            // await useCurrentUserStore().initStore(resp.data.id);
		await useCurrentUserStore().initStore(tokData.id, tokData.email);
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },

    async signUpLocal(email: string, username:string, password: string){
      try {
        const resp = await api.signUpLocal(email, username, password);
        const tokData = api.decodePayload(resp.data.accessToken);
        // console.log("Acces token is",resp.data.access_token.accesToken)
        // this.setState(resp.data.accessToken, resp.data.refreshToken, true); //questo giusto dopo per ora facciamo registration false
        this.setState(resp.data.accessToken, resp.data.refreshToken);
        console.log(this.token)
				// this.twoFaEnabled = resp.data.twoFaEnabled;

        // await useCurrentUserStore().initStore(resp.data.id);
		await useCurrentUserStore().initStore(tokData.id, tokData.email);
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },
    // google
    // async signInGoogle(params: string): Promise<IError | undefined> {
    //   try {
    //     const resp = await api.signInGoogle(params);
    //     this.setState(resp.data.access_token);
	// 			this.twoFaEnabled = resp.data.twoFaEnabled;

	// 			if (!this.twoFaEnabled)
    //         await useCurrentUserStore().initStore(resp.data.id);
    //   } catch (err) {
    //     const e = err as AxiosError<IError>;
    //     if (axios.isAxiosError(e)) return e.response?.data;
    //   }
    // },
    // async signUpGoogle(params: string) {
    //   try {
    //     const resp = await api.signUpGoogle(params);
    //     this.setState(resp.data.access_token, true);
	// 			this.twoFaEnabled = resp.data.twoFaEnabled;

    //     await useCurrentUserStore().initStore(resp.data.id);
    //   } catch (err) {
    //     const e = err as AxiosError<IError>;
    //     if (axios.isAxiosError(e)) return e.response?.data;
    //   }
    // },

    // 42
    async signInFortyTwo(accessToken: string, refreshToken: string): Promise<IError | undefined> {
      try {
      const tokData = api.decodePayload(accessToken);
      this.setState(accessToken, refreshToken);
      // this.twoFaEnabled = resp.data.twoFaEnabled;
      // if (!this.twoFaEnabled)
      console.log("awman", tokData);
      await useCurrentUserStore().initStore(tokData.id, tokData.email);
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },
    // async signUpFortyTwo(params: string) {
    //   try {
    //     const resp = await api.signUpFortyTwo(params);
    //     this.setState(resp.data.access_token, true);
		// 		this.twoFaEnabled = resp.data.twoFaEnabled;

    //     await useCurrentUserStore().initStore(resp.data.id);
    //   } catch (err) {
    //     const e = err as AxiosError<IError>;
    //     if (axios.isAxiosError(e)) return e.response?.data;
    //   }
    // },
	async initStoreasync(){
		if (this.token)
      await useCurrentUserStore().initStore(null, null);
    },

    setState(token: string, refreshToken: string,  registerInProgress: boolean = false){
      this.token = token;
      this.refreshToken = refreshToken;
      this.registerInProgress = registerInProgress;
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
      this.registerInProgress = false;
      useCurrentUserStore().$reset();
    }
  },
});