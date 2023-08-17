import http from '@/http';
import type { IFriend } from '@/models/IFriendsLists';

class FriendService {
  // async getFriendships(userId: number, status: string): Promise<IFriend[]> {
  //   const friendships = await http.get(`/users/${userId}/friends?status=${status}`);
  //   const list: IFriend[] = [];
  //   friendships.data.forEach((friendship: any) => {
  //     list.push({ id: friendship.id, username: friendship.username });
  //   });
  //   return list;
  // }
  async sendFriendRequest(friendId:string) {
    return await http.post<string>(`/user/add_friend`,{
        friendId})
    }
  async acceptFriendship(friendId:string) {
    return await http.post(`/user/accept_friend_request`, {
      friendId});
  }

  async blockUser(userId: string) {
    const response = await http.post<string>(`/user/block_user`, {
      blockedId: userId});
	console.log("hello there me ", response.data);
	console.log(response);
	return (response.data);
  }

  async unBlockUser(userId: string) {
    const response = await http.post<string>(`/user/block_remove`, {
		userIdToUnblock: userId});
	console.log("hello there me ", response.data);
	console.log(response);
	return (response.data);
  }

async getFriendRequest(friendId:string) {
    const response =  await http.get<IFriend[]>(`/user/received_friend_requests`, { 
		data: {
			friendId: friendId
    }
	});
	console.log("Friends resposne: ", response.data);
	return response.data;
  }

  async getBlockedRequest() {
    const response =  await http.get<IFriend[]>(`/user/blocked_users`);
	console.log("Friends resposne: ", response.data);
	return response.data;
  }

  async getFriendSent(friendId:string) {
	const response =  await http.get<IFriend[]>(`/user/sent_friend_requests`, { 
		data: {
			friendId: friendId
      }
	});
	console.log("Friends resposne: ", response.data);
	return response.data;
  }

  async getFriendList() {
    const response =  await http.get<IFriend[]>(`/user/friends`, { 
	});
	console.log("Friends resposne: ", response.data);
	return response.data;
  }

  async endFriendship(friendId:string) {
    return await http.delete(`/user/remove_friend`, {
      data: {
        friendId: friendId
      }
    });
}
}
export default new FriendService();