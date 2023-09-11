import http from '@/http';
import { type IMatchHistory, type IUser } from '@/models/IUser';

class UserService {
  async paginate(link: string) {
    return await http.get(link);
  }
  async getUserById(id: string | string[] ) {
    const response = await http.get<IUser>(`/user/${id}`);
    return (response.data)
}

  async getUsers() {
    const response = await http.get<IUser[]>(`/user`);
    return (response.data)
  }

  async getMatchHistory() {
    const response = await http.get<IMatchHistory[]>(`/user/matchHistory`);
    return (response.data)
  }

  updateMe(attrs: Partial<IUser>) {
    return http.patch<Partial<IUser>>('/users', attrs);
  }
  async updateUserName(newUser: string): Promise<IUser> {
	const response = await http.post('/user/update_username', {newUsername: newUser});
    return (response.data);
  }
  async updateProfilePicture(newPicture: string): Promise<IUser> {
	const response = await http.post('/user/update_image', {newImage: newPicture});
    return (response.data);
  }

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
