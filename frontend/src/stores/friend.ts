import { defineStore } from 'pinia';

import UserService from '@/services/UserService';
import FriendService from '@/services/FriendService';
import type { IUser } from '@/models/IUser';
import axios, { AxiosError } from 'axios';
import type { IError } from '@/models/IError';
import type { IFriendLists, IFriend } from '@/models/IFriendsLists';
import { useLocalStorage, } from '@vueuse/core';

export const useFriendStore = defineStore('friend', {
	state: (): {
		friends: IFriend[];
		pending: IFriend[];
		sent: IFriend[];
		blocked: IFriend[];
		// ... any other state properties ...
	  } => ({
		friends: [],
		pending: [],
		sent: [],
		blocked: [],
		// ... any other state initializations ...
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
    async initStore(userId: string | null) {
      try {
        /*
        Da implementare chiamate User
        */
        const friend = await FriendService.getFriendList(userId!);
		const pending = await FriendService.getFriendRequest(userId!);
		const sent = await FriendService.getFriendSent(userId!);
		const blocked = await FriendService.getBlockedRequest();

        // const avatar = await UserService.getAvatarOfUser(this.userId); 
        /*
        Da implementare chiamate Friends
        */
        // const friends = await FriendService.getFriendships(this.userId, "accepted");
        // const pendings = await FriendService.getFriendships(this.userId, "pending");
        // this.setStore(user.data, avatar);
		this.setStore(friend, pending, sent, blocked);
		// console.log("initialized ", this.friends, this.pending);
	} catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },
    setStore(friend: IFriend[], pending: IFriend[], sent: IFriend[], blocked: IFriend[]) {
      this.friends = friend;
      this.pending = pending;
	  this.sent = sent;
	  this.blocked = blocked;
    },
    // updateAvatar(avatar: string) {
    //   this.avatar = avatar;
    // },
	// async updateUser(user: string) {
	// 	const updatedUser = await UserService.updateUserName(user);
    // this.setStore(updatedUser, updatedUser.profilePicture/*, { friends, pendings, sent }*/);
    // },
	// async updatePicture(picture: string) {
    //   const updatedPicture = await UserService.updateProfilePicture(picture);
    //   this.setStore(updatedPicture, updatedPicture.profilePicture/*, { friends, pendings, sent }*/);
    // },
    async updateFriends(userId: string) {
      this.friends = await FriendService.getFriendList(userId!);
    },
    async updatePendings(userId: string) {
      this.pending = await FriendService.getFriendRequest(userId!);
    },
	async updateSent(userId: string) {
		this.pending = await FriendService.getFriendSent(userId!);
	},
	async updateBlocked() {
		this.pending = await FriendService.getBlockedRequest();
	},
    // async updateSent(userId: number) {
    //   this.friendLists.sent = await FriendService.getFriendships(userId, "sent");
    // },
  },
});