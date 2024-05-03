import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: () => import('../views/AuthView.vue')
    },
    {
      path: '/chat/global',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/chat',
      redirect: '/chat/global'
    }
  ]
});

router.beforeEach((to, from, next) => {
  // check if the user is logged in
  const isLoggedIn = !!sessionStorage.getItem('jwt');

  // if the user is trying to access the auth page while logged in, redirect to /chat
  if (to.name === 'auth' && isLoggedIn) {
    next({ name: 'chat' });
  }
  // check if the route requires authentication
  else if (to.matched.some((record) => record.meta.requiresAuth)) {
    // check if the user is not logged in
    if (!isLoggedIn) {
      // if not logged in, redirect to the auth page
      next({ name: 'auth' });
    } else {
      // if logged in, proceed to the route
      next();
    }
  } else {
    // if the route does not require authentication, proceed to the route
    next();
  }
});

export default router;
