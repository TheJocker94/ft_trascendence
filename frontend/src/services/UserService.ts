import http from '@/http';
import { type IMatchHistory, type IUser } from '@/models/IUser';

class UserService {
  async paginate(link: string) {
    return await http.get(link);
  }
  async getUserById(id: string | string[] ) {
    const response = await http.get<IUser>(`/user/${id}`);
	// console.log("wtf reponse: ", response.data);
    return (response.data)
}

  async getUsers() {
    const response = await http.get<IUser[]>(`/user`);
    // console.log("Lore invia ", response.data)
    return (response.data)
  }

  async getMatchHistory() {
    const response = await http.get<IMatchHistory[]>(`/user/matchHistory`);
    return (response.data)
  }
  // async getAvatarOfUser(userId: string): Promise<string> {
  //   const response = await http.get(`/user/${userId}/avatar`, { responseType: 'arraybuffer' });
	// 	return formatImage(response.data);
  // }
  // async setMyAvatar(myUserId: number, avatar: File): Promise<string> {
  //   const formData = new FormData();
  //   formData.append('image', avatar);
  //   const response = await http.put(`/users/${myUserId}/avatar`, formData, { responseType: 'arraybuffer' });
	// 	return formatImage(response.data);
  // }
  updateMe(attrs: Partial<IUser>) {
    return http.patch<Partial<IUser>>('/users', attrs);
  }
  async updateUserName(newUser: string): Promise<IUser> {
	const response = await http.post('/user/update_username', {newUsername: newUser});
    return (response.data);
    // return http.post('/user/updateUsername', username);
  }
  async updateProfilePicture(newPicture: string): Promise<IUser> {
	const response = await http.post('/user/update_image', {newImage: newPicture});
    return (response.data);
    // return http.post('/user/updateUsername', username);
  }
  // async resetDefaultAvatar(myUserId: number): Promise<string> {
  //   const response = await http.delete(`/users/${myUserId}/avatar`, { responseType: 'arraybuffer' });
	// 	return formatImage(response.data);
  // }
  async getGameHistory(userId: number) {
    return await http.get(`/game/${userId}`);
  }
  async getGamePagination(userId: number, link: string) {
    return await http.get(link);
  }
  usernameExists(username: string): Promise<boolean> {
    return http.head(`/username/${username}`).then( () => {
      return true; 
    }).catch( () => {
      return false;
    })
  }
}
export default new UserService();