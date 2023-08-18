import './assets/index.css'
// import Socketio from "@/plugins/Socket.io";
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VueSocketIO from 'vue-socket.io'

// import { io } from 'socket.io-client';

// const socket = io("http://localhost:3000");

// 	socket.on('messageFromServer', (dataFromServer) =>{
// 		console.log(dataFromServer);
// 	socket.emit('messageToServer', {data: 'Data from the client!'});
// 	})

// socket.on("connect", () => {
//   console.log('Connected to the server balh blah balh');
// });

// socket.on("disconnect", () => {
//   console.log('Disconnected from the server');
// });

const app = createApp(App)
app.use(createPinia())
app.use(router)
// app.use(new VueSocketIO({
//     debug: true,
//     connection: 'http://localhost:3000',
//   }))
app.mount('#app')
