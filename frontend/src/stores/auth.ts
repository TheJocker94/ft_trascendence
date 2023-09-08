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
      registerInProgress: useLocalStorage('registerInProgress', false),
      needsRefresh: false,
      twoFaEnabled: false,
      twofa: ref(''),
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
        console.log('Lore ti vuole? ',resp.data.is2faEnabled);
        if (resp.data.is2faEnabled)
        {
          // Popup per inserire il codice
          return true;
          //Chiamata @Post('local/signin/2fa'{verificationCode: string})

        }

        const tokData = api.decodePayload(resp.data.tokens.accessToken);
        console.log(resp.data.tokens.accessToken);
        console.log(resp.data.tokens.refreshToken);


        this.setState(resp.data.tokens.accessToken, resp.data.tokens.refreshToken, false, resp.data.tokens.is2faEnabled);
        console.log("token saved is", this.token)
				// this.twoFaEnabled = resp.data.twoFaEnabled;
				// if (!this.twoFaEnabled)
            // await useCurrentUserStore().initStore(resp.data.id);
            // await this.renewToken();
		await useCurrentUserStore().initStore(tokData.id, tokData.email, this.twoFaEnabled);
        router.push('/users/' + useCurrentUserStore().userId);
  } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },

    async signInLocal2fa (emailcode: string
    ): Promise<IError | undefined> {
      try {
        const resp = await api.signInLocal2fa(emailcode);
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
		await useCurrentUserStore().initStore(tokData.id, tokData.email, this.twoFaEnabled);
        router.push('/users/' + useCurrentUserStore().userId);
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },
    async renewToken() {
      try {
        const response = await AuthService.refresh() // Make sure you have an API method to renew the token
        console.log("response", response.data);
        const newAccessToken = response.data.access_token;
        this.token = newAccessToken;
      } catch (err) {
        console.error('Error renewing token:', err);
        // Handle token renewal error here
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
      await useCurrentUserStore().initStore(tokData.id, tokData.email, this.twoFaEnabled);
      router.push('/users/' + useCurrentUserStore().userId);
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
      await useCurrentUserStore().initStore(null, null, this.twoFaEnabled);
    },

    setState(token: string, refreshToken: string,  registerInProgress: boolean = false, is2faEnabled: boolean = false){
      this.token = token;
      this.refreshToken = refreshToken;
      this.registerInProgress = registerInProgress;
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
      this.registerInProgress = false;
      useCurrentUserStore().$reset();
    }
  },
});
