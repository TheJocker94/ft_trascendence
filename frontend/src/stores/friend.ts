import { defineStore } from 'pinia';
import FriendService from '@/services/FriendService';
import axios, { AxiosError } from 'axios';
import type { IError } from '@/models/IError';
import type { IFriend } from '@/models/IFriendsLists';
import { ref } from 'vue';

export const useFriendStore = defineStore('friend', {
  state: () => ({
    friends: ref<IFriend[]>([]),
    pending: ref<IFriend[]>([]),
    sent: ref<IFriend[]>([]),
    blocked: ref<IFriend[]>([]),
  }),

  actions: {
    async initStore(userId: string | null) {
      try {

        const friend = await FriendService.getFriendList();
		const pending = await FriendService.getFriendRequest(userId!);
		const sent = await FriendService.getFriendSent(userId!);
		const blocked = await FriendService.getBlockedRequest();

		this.setStore(friend, pending, sent, blocked);
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

    async updateFriends() {
      this.friends = await FriendService.getFriendList();
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
  },
});
