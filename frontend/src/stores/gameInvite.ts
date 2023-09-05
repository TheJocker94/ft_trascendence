import { defineStore } from 'pinia';
import GameInviteService from '@/services/GameInviteService';
import axios, { AxiosError } from 'axios';
import type { IError } from '@/models/IError';
import type { IGInvite } from '@/models/IGameInvite';

export const useGameInviteStore = defineStore('game', {
	state: (): {
			friends: IGInvite[];
			pending: IGInvite[];
			sent: IGInvite[];
    } => ({
			friends: [],
			pending: [],
			sent: [],
    }),

	actions: {
    async initStore(userId: string | null) {
      try {
        const friend = await GameInviteService.getGameInviteList();
				const pending = await GameInviteService.getGameInvitesRequests(userId!);
				const sent = await GameInviteService.getGameInvite(userId!);
				this.setStore(friend, pending, sent);
			} catch (err) {
        const e = err as AxiosError<IError>;
        if (axios.isAxiosError(e)) return e.response?.data;
      }
    },

    setStore(friend: IGInvite[], pending: IGInvite[], sent: IGInvite[]) {
      this.friends = friend;
      this.pending = pending;
			this.sent = sent;
			console.log("friends ", this.friends);
			console.log("pending ", this.pending);
			console.log("sent ", this.sent);
		},
		
    async updateFriends() {
			this.friends = await GameInviteService.getGameInviteList();
		},

    async updatePendings(userId: string) {
			this.pending = await GameInviteService.getGameInvitesRequests(userId!);
    },
		
		async updateSent(userId: string) {
			this.pending = await GameInviteService.getGameInvite(userId!);
		},
  },
});