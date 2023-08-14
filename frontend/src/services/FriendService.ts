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
  async sendFriendRequest(friendId:string) {
    return await http.post<string>(`/user/add_friend`,{
        friendId})
    }
  async acceptFriendship(friendId:string) {
    return await http.post(`/user/accept_friend_request`, {
      friendId});
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