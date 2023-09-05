import http from '@/http';
import type { IGInvite } from '@/models/IGameInvite';
// import type { InviteFriendsDto } from '@/models/IFriendsLists';

class GameInviteService {
	async sendGameInvite(gameId: string) {
    return await http.post<string>(`/user/invite_to_play`,{ 
		gameId })
	}

	async acceptGameInvite(gameId: string) {
    return await http.post(`/user/accept_game_invite`, { gameId });
  }

	async getGameInvitesRequests(gameId: string) {
			const response =  await http.get<IGInvite[]>(`/user/received_game_invite`, {
			data: {
				gameId: gameId
			}
		});
		return response.data;
  }

  async getGameInvite(gameId:string) {
	const response =  await http.get<IGInvite[]>(`/user/sent_game_invite`, {
		data: {
			gameId: gameId
      }
	});
	return response.data;
  }

  async getGameInviteList() {
    const response =  await http.get<IGInvite[]>(`/user/friends_invited`, {
		});
		return response.data;
  }

  async endGameInvite(gameId:string) {
    return await http.delete(`/user/remove_invite`, {
      data: {
        gameId: gameId
      }
    });
  }
}
export default new GameInviteService();