import './assets/main.css'
import Socketio from "@/plugins/Socket.io";
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(Socketio, {
    connection: "http://localhost:3000",
    options: {
      autoConnect: false, //Turn off automatic connection
      // ... Other options
    },
  });
app.use(createPinia())
app.use(router)

app.mount('#app')
