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
  async acceptFriendship(applicantId: number, recipientId: number) {
    return await http.patch(`/users/${applicantId}/friends/${recipientId}`);
  }
  async endFriendship(applicantId: number, recipientId: number, status: string) {
    return await http.delete(`/users/${applicantId}/friends/${recipientId}?status=${status}`);
  }
}
export default new FriendService();