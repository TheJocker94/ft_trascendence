<template>
  <div class="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
    <div class="card-body">
      <div v-for="(message, index) in messages" :key="index" :class="['chat', message.myself === true ? 'chat-end' : 'chat-start']">
        <div class="chat-header">
          {{ message.sender }}
          <time class="text-xs opacity-50">{{ message.time }}</time>
        </div>
        <div class="chat-bubble">{{ message.text }}</div>
        <!-- <div class="chat-footer opacity-50">
          {{ message.status }}
        </div> -->
      </div>
      <!-- Input + button together -->
      <div class="join  max-w-lg">
        <input v-model="msg" @keyup.enter="sendMessage" class="input input-bordered join-item" placeholder="Message"/>
        <button @click="sendMessage" class="btn join-item btn-primary rounded-r-full">Send</button>
      </div>
      <!-- Input + button apart -->
      <!-- <div class="form-control">
        <input v-model="msg" @keyup.enter="sendMessage" type="text" placeholder="Message" class="input input-bordered" />
      </div>
      <div class="form-control">
        <button @click="sendMessage" class="btn btn-primary">Send</button>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import {socket} from "@/plugins/Socket.io";
// import SelectUsername from '@/components/chat/SelectUsername.vue'
import { ref, onMounted, onUnmounted} from 'vue';
// import { useChatStore } from '@/stores/chat';
import { useCurrentUserStore } from "@/stores/currentUser";
import type { INewMessage } from '@/models/IChat'
const usernameAlreadySelected = ref(false);
const userStore = ref(useCurrentUserStore());
const msg = ref('');
// const myself = ref<boolean>()
const messages = ref<INewMessage[]>([]);

const sendMessage = () => {
  if (msg.value === '')
  return;
  const newMessage = {
    sender: userStore.value.username, // Set the sender's username
    text: msg.value,
    time: new Date().toLocaleTimeString(), // Set the message time
    status: 'Delivered', // Set the status for the sender's message
    myself: true
  };
  messages.value.push(newMessage);
  socket.emit('messageToServer', {text: msg.value});
  msg.value = '';
  };
socket.on('messageFromServer', (dataFromServer)=> {
    if (dataFromServer.username === userStore.value.username)
      return;
    const newMessage = {
    sender: dataFromServer.username, // Set the sender for the received message
    text: dataFromServer.text,
    time: new Date().toLocaleTimeString(), // Set the message time
    status: 'Seen', // Set the status for the received message
    myself: false
  };

  messages.value.push(newMessage);
})
// socket.on('ping', () => {
//   console.log('Ping was received from the server')
// })
// socket.on('pong', (latency:number) => {
//   console.log('Pong was received from the server, latency is ', latency)
// })
onMounted( async () => {
  await userStore.value.initStore(null, null);
  const username = userStore.value.username;
  socket.auth = { username};
  socket.connect();
  socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        usernameAlreadySelected.value = false;
      }
    });
  socket.on('welcome', (message:string) => {
    console.log(message);
  });
  // socket.on('messageFromServer', (dataFromServer)=> {
  //   console.log(dataFromServer);
  //   socket.emit('dataToServer', {data:'Data from client'})
  // })
  // socket.on('ping', () => {
  //   console.log('Ping was received from the server')
  // })
  // socket.on('pong', (latency:number) => {
  //   console.log('Pong was received from the server, latency is ', latency)
  // })
  });
onUnmounted(() => {
  socket.off('connect');
  socket.off('connect_error');
  socket.disconnect();
});
  // socket.on('message', (msg) => {
  //   chatStore.value.addMessage(msg)
  // });


</script>
