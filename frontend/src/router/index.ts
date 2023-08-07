import { createRouter, createWebHistory } from 'vue-router'
// import { useAuthStore } from "@/stores/auth";
import HomeView from '../views/HomeView.vue'
import GameView from '../views/GameView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/game',
      name: 'game',
      component: GameView,
      meta: {
        title: 'game',
        requiresAuth: true
      },
    },
  ]
})
// const authStore = useAuthStore();
// console.log(authStore.isLoggedIn)
router.beforeEach((to, from, next) => {
  // Get the meta.title property from the destination route
  const title = to.meta.title || 'Transcendence'; // Use a default title if not specified
  
  // Set the document title to the specified title
  document.title = `Transcendence - ${title}`;
  
  // Continue with the navigation
  next();
});
export default router
