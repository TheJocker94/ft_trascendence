import { defineStore } from 'pinia';
import GameInviteService from '@/services/GameInviteService';
import axios, { AxiosError } from 'axios';
import type { IError } from '@/models/IError';
import type { IGInvite } from '@/models/IGameInvite';
import { ref, computed } from 'vue';
import { useCurrentUserStore } from './currentUser';

export const useGameStore = defineStore('game', () => {
	const accepted = ref<any[]>([]); 
	const waiting = ref<any[]>([]);
	const thinking = ref<any[]>([]);
	const getAcceptef = computed(() => accepted.value);
	const getWaiting = computed(() => waiting.value);
	const getThinking = computed(() => thinking.value);
	const setAccepted = (val:any[]) => { accepted.value = val }
	const setWaiting = (val:any[]) => { waiting.value = val }
	const setThinking = (val:any[]) => { thinking.value = val }
	const renderer = ref(false);
	const getRenderer = computed(() => renderer.value);
	const setRenderer = (val:boolean) => { renderer.value = val }
	const updateInvite = async () => {
		const userId = useCurrentUserStore().userId;
		accepted.value = await GameInviteService.getAcceptedGameInvite();
		waiting.value = await GameInviteService.getWaitingGameInvite(userId!);
		thinking.value = await GameInviteService.getThinkingGameInvite(userId!);
	}
	
	const initStore = async (userId: string | null) => {
		try {
			accepted.value = await GameInviteService.getAcceptedGameInvite();
			waiting.value = await GameInviteService.getWaitingGameInvite(userId!);
			thinking.value = await GameInviteService.getThinkingGameInvite(userId!);
		} catch (err) {
			const e = err as AxiosError<IError>;
			if (axios.isAxiosError(e)) return e.response?.data;
		}
	}

	return {
		accepted, waiting, thinking, renderer, getAcceptef, getWaiting, getThinking, setAccepted, setWaiting, setThinking, updateInvite,
		getRenderer, setRenderer, initStore
	}
});
// export const useGameInviteStore = defineStore('game', {
// 	state: (): {
// 			accepted: IGInvite[];
// 			thinking: IGInvite[];
// 			waiting: IGInvite[];
// 			renderer: boolean;
//     } => ({
// 			accepted: [],
// 			thinking: [],
// 			waiting: [],
// 			renderer: false,
//     }),

// 	actions: {
//     async initStore(userId: string | null) {
//       try {
//         const accepted = await GameInviteService.getGameInviteList();
// 		const waiting = await GameInviteService.getGameInvitesRequests(userId!);
// 		const sent = await GameInviteService.getGameInvite(userId!);
// 		this.setStore(friend, pending, sent);
// 	  } catch (err) {
//         const e = err as AxiosError<IError>;
//         if (axios.isAxiosError(e)) return e.response?.data;
//       }
//     },

//     setStore(friend: IGInvite[], pending: IGInvite[], sent: IGInvite[]) {
//       this.friends = friend;
//       this.pending = pending;
// 			this.sent = sent;
// 			// console.log("friends ", this.friends);
// 			// console.log("pending ", this.pending);
// 			// console.log("sent ", this.sent);
// 		},
		
//     async updateFriends() {
// 			this.friends = await GameInviteService.getGameInviteList();
// 		},

//     async updatePendings(userId: string) {
// 			this.pending = await GameInviteService.getWaitingGameInvite(userId!);
//     },
		
// 	async updateSent(userId: string) {
// 		this.pending = await GameInviteService.getGameInvite(userId!);
// 	},
//   },
// });
