import http from '@/http';
import type { IFriend } from '@/models/IFriendsLists';

class FriendService {
  async getFriendships(userId: number, status: string): Promise<IFriend[]> {
    const friendships = await http.get(`/users/${userId}/friends?status=${status}`);
    const list: IFriend[] = [];
    friendships.data.forEach((friendship: any) => {
      list.push({ id: friendship.id, username: friendship.username });
    });
    return list;
  }
  async sendFriendRequest(idfriend:string) {
    return await http.post(`/user/add_friend`, { friendId: idfriend });
  }
  async acceptFriendship(idfriend:string) {
    return await http.post(`/user/accept_friend_request`, { friendId: idfriend });
  }
async endFriendship(idfriend:string) {
    return await http.delete(`/user/remove_friend`, { friendId: idfriend } );
}
}
export default new FriendService();