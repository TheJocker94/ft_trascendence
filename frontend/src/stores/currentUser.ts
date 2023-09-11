import { defineStore } from 'pinia';

import UserService from '@/services/UserService';
import { useFriendStore } from './friend';
// import FriendService from '@/services/FriendService';
// import FriendService from '@/services/FriendService';
import type { IUser } from '@/models/IUser';
import axios, { AxiosError } from 'axios';
import type { IError } from '@/models/IError';
// import { IFriendLists } from '@/models/IFriendLists';
import { useLocalStorage, } from '@vueuse/core';
import { useGameStore } from './gameInvite';

export const useCurrentUserStore = defineStore('currentUser', {
	state: () => ({
    userId: useLocalStorage('userId', ''),
    username: '',
    email: '',
    avatar: '',
    friendStore: useFriendStore(),
	gameInviteStore: useGameStore(),
    // Game info
    roomId: '',
    playerNo: 0,
    username1: '',
    username2: '',
  }),

  actions: {
    async initStore(userId: string | null, email: string | null) {
      if (userId)
        this.userId = userId;
      if (email)
        this.email = email;
      try {
        const user = await UserService.getUserById(this.userId);
        this.setStore(user, user.profilePicture/*, { friends, pendings, sent }*/);
		this.friendStore.initStore(this.userId);
		this.gameInviteStore.initStore(this.userId);
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },
    initGame(roomId: string, playerNo: number, username1: string, username2: string) {
      if (roomId)
        this.roomId = roomId;
      if (playerNo)
        this.playerNo = playerNo;
      if (username1)
        this.username1 = username1;
      if (username2)
        this.username2 = username2;
    },
    setStore(user: IUser, avatar: string, /*friendLists: IFriendLists*/) {
      this.userId = user.id;
      this.username = user.username;
      this.email = user.email;
      this.avatar = avatar;
    //   this.friendLists = friendLists;
    },
    updateAvatar(avatar: string) {
      this.avatar = avatar;
    },
	async updateUser(user: string) {
		const updatedUser = await UserService.updateUserName(user);
    this.setStore(updatedUser, updatedUser.profilePicture/*, { friends, pendings, sent }*/);
    },
	async updatePicture(picture: string) {
      const updatedPicture = await UserService.updateProfilePicture(picture);
      this.setStore(updatedPicture, updatedPicture.profilePicture/*, { friends, pendings, sent }*/);
    },

  },
});
