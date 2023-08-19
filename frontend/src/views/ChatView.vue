<template>
  <div>

  </div>
</template>

<script setup lang="ts">
import socket from "@/plugins/Socket.io";
// import SelectUsername from '@/components/chat/SelectUsername.vue'
import { ref, onMounted, onUnmounted} from 'vue';
// import { useChatStore } from '@/stores/chat';
import { useCurrentUserStore } from "@/stores/currentUser";
const usernameAlreadySelected = ref(false);
const userStore = ref(useCurrentUserStore());

// const sendMessage = () => {
//   const msg = {
//     username: username,
//     content: messageContent.value,
//   };
//     socket.emit('message', msg);
//     chatStore.value.addMessage(msg)
//     messageContent.value = '';
// }

// const connectinit = () => {
//   console.log("Username is ", username);
//   socket.auth = { username };
//   console.log("Username after is ", username);

//   socket.connect();

// } 
socket.on('messageFromServer', (dataFromServer)=> {
    console.log(dataFromServer);
    socket.emit('dataToServer', {data:'Data from client'})
})
socket.on('ping', () => {
  console.log('Ping was received from the server')
})
socket.on('pong', (latency:number) => {
  console.log('Pong was received from the server, latency is ', latency)
})
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
