import http from '@/http';
import type { IGInvite } from '@/models/IGameInvite';

class GameInviteService {
	async sendGameInvite(gameId: string) {
    return await http.post<string>(`/user/invite_to_play`,{ 
		gameId: gameId })
	}

	async acceptGameInvite(gameId: string) {
    return await http.post(`/user/accept_game_invite`, { gameId });
  }

	async getWaitingGameInvite(gameId: string) {
			const response =  await http.get<any[]>(`/user/waiting_game_invite`, {
			data: {
				gameId: gameId
			}
		});
		return response.data;
  }

  async getThinkingGameInvite(gameId:string) {
	const response =  await http.get<any[]>(`/user/thinking_game_invite`, {
		data: {
			gameId: gameId
      }
	});
	return response.data;
  }

  async getAcceptedGameInvite() {
    const response =  await http.get<any[]>(`/user/accepted_game_invite`, {
		});
		return response.data;
  }

  async deleteGameInvite(gameId:string) {
    return await http.delete(`/user/remove_game_invite`, {
      data: {
        gameId: gameId
      }
    });
  }
}
export default new GameInviteService();
