import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import './assets/index.css';

const app = createApp(App);

// Use Pinia
app.use(createPinia());

// Use Router
app.use(router);

app.mount('#app');
