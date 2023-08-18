<template>
    <div class="live-chat">
      <div class="row">
        <div class="col">
          <div class="cards">
            <div class="card" v-for="(message, index) in messages" :key="index">
              <div class="card-body">
                <h5 class="card-title">{{ message.username }}</h5>
                <div class="card-text">{{ message.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <input type="text" class="form-control" placeholder="Enter Message..." v-model="messageContent" @keypress.enter="sendMessage" />
        </div>
        <div class="col">
          <button type="button" class="btn btn-primary" @click.prevent="triggerFromRest">Trigger From REST</button>
        </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { socket } from "@/plugins/Socket.io";
import { ref, onBeforeMount, onBeforeUnmount } from 'vue';
import { useChatStore } from '@/stores/chat';
import { useCurrentUserStore } from "@/stores/currentUser";
import ChatService from '@/services/ChatService'

const messageContent = ref('');
const chatStore = ref(useChatStore());
const currentUser = ref(useCurrentUserStore());
const messages = ref(chatStore.value.messages)
const username = ref(chatStore.value.username);
const triggerFromRest = ChatService.chat;
const sendMessage = () => {
  const msg = {
    username: username,
    content: messageContent.value,
  };
    socket.emit('message', msg);
    chatStore.value.addMessage(msg)
    messageContent.value = '';
}
onBeforeMount(() => {
  socket.auth = { username: currentUser.value.username };
  socket.on('connect', () => {
    console.log('connected');
  });

  socket.on("connect_error", (err) => {
  if (err.message === "invalid username") {
    console.log('invalid username');
  }
});

onBeforeUnmount(() => {
  // socket.off('connect');
  socket.off('connect_error');
});
  // socket.on('message', (msg) => {
  //   chatStore.value.addMessage(msg)
  // });
});

</script>
