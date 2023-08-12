import { defineStore } from 'pinia';

import UserService from '@/services/UserService';
// import FriendService from '@/services/FriendService';
// import FriendService from '@/services/FriendService';
import type { IUser } from '@/models/IUser';
import axios, { AxiosError } from 'axios';
import type { IError } from '@/models/IError';
// import { IFriendLists } from '@/models/IFriendLists';
import { useLocalStorage, } from '@vueuse/core';

export const useCurrentUserStore = defineStore('currentUser', {
  state: () => ({
    userId: useLocalStorage('userId', ''),
    username: '',
    email: '',
    avatar: '',
    // friendLists: {
    //   friends: [],
    //   pendings: [],
    //   sent: []
    // } as IFriendLists,
  }),
  // getters: {
    // isFriend : (state) => {
	// 		return (id : number) => state.friendLists.friends.some(friend => friend.id === id);
	// 	},
    // isPending : (state) => {
	// 		return (id : number) => state.friendLists.pendings.some(pending => pending.id === id);
	// 	},
    // isSent : (state) => {
	// 		return (id : number) => state.friendLists.sent.some(sent => sent.id === id);
	// 	},
  // },
  actions: {
    async initStore(userId: string | null, email: string | null) {
      if (userId)
        this.userId = userId;
      if (email)
        this.email = email;
      try {
        /*
        Da implementare chiamate User
        */
        const user = await UserService.getUserById(this.userId);
        // const avatar = await UserService.getAvatarOfUser(this.userId); 
        /*
        Da implementare chiamate Friends
        */
        // const friends = await FriendService.getFriendships(this.userId, "accepted");
        // const pendings = await FriendService.getFriendships(this.userId, "pending");
        // const sent = await FriendService.getFriendships(this.userId, "sent");
        // this.setStore(user.data, avatar);
        this.setStore(user.data, user.data.profilePicture/*, { friends, pendings, sent }*/);
      } catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
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
    // async updateFriends(userId: number) {
    //   this.friendLists.friends = await FriendService.getFriendships(userId, "accepted");
    // },
    // async updatePendings(userId: number) {
    //   this.friendLists.pendings = await FriendService.getFriendships(userId, "pending");
    // },
    // async updateSent(userId: number) {
    //   this.friendLists.sent = await FriendService.getFriendships(userId, "sent");
    // },
  },
});