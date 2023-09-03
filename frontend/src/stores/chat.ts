import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

export const useChatStore = defineStore('chat', {
  state: () => ({
    username: '',
    connected: false,
    users: 0,
    messages: []
    }),
    getters: {
      Messages(state: any) {
        return state.messages;
    },
    Username(state: any) {
        return state.username;
    }
  },
  actions: {
    addMessage(message: any) {
      this.messages.push(message);
    },
    updateUsers(users: number) {
      this.users = users;
    },
    setUsername(nickname: string) {
      this.username = nickname;
      const router = useRouter();
      router.replace({ name: 'live-chat' });
    },
    setConnected(flag: boolean) {
      this.connected = flag;
    },
    socketMessage(message: any) {
      this.addMessage(message);
    },
    socketUsers(users: number) {
      this.updateUsers(users);
    },
    socketJoin(nickname: string) {
      this.addMessage({
        username: nickname,
        content: 'Joined...',
      });
    },
    socketTriggerRest() {
      this.addMessage({
        username: 'REST',
        content: 'Triggered by REST API',
      });
    },
    socketConnect() {
      this.setConnected(true);
    },
    socketDisconnect() {
      this.setConnected(false);
    },
    socketConnectError() {
      this.setConnected(false);
    },
  },
});