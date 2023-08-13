import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/auth";
import HomeView from '../views/HomeView.vue'
import GameView from '../views/GameView.vue'
import ProfileView from '../views/ProfileView.vue'
import FriendsView from '../views/FriendsView.vue'
import UserProfile from '../views/UserProfile.vue';

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
    {
      path: '/friends',
      name: 'friends',
      component: FriendsView,
      meta: {
        title: 'Friend',
        requiresAuth: true
      },
    },
    {
      name: "profile",
      path: "/users/:userid",
      meta: {
        title: 'Profile',
        requiresAuth: true
      },
      component: ProfileView,
    },
	{
		path: '/user-profile/:userId',
		name: 'UserProfile',
		component: UserProfile,
		props: true
	  },
  ]
})
// const authStore = useAuthStore();
// console.log(authStore.isLoggedIn)
router.beforeEach((to, from, next) => {
  // Get the meta.title property from the destination route
  const title = to.meta.title || 'Transcendence'; // Use a default title if not specified
  const authStore = useAuthStore();
  // Set the document title to the specified title
  document.title = `Transcendence - ${title}`;
  if (to.meta.requiresAuth && !authStore.isLoggedIn)
    next('/');
  else if (to.meta.requiresUnAuth && authStore.isLoggedIn)
		next('/');
  else
    next();
});
export default router
