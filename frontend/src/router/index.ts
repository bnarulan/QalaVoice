import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Feed', component: () => import('../views/FeedPage.vue') },
    { path: '/post/:id', name: 'Post', component: () => import('../views/PostDetailPage.vue') },
    { path: '/complaint', name: 'Complaint', component: () => import('../views/ComplaintPage.vue'), meta: { auth: true } },
    { path: '/rating', name: 'Rating', component: () => import('../views/RatingPage.vue') },
    { path: '/admin', name: 'Admin', component: () => import('../views/AdminPage.vue'), meta: { auth: true } },
    { path: '/admin/register', name: 'AdminRegister', component: () => import('../views/AdminRegisterPage.vue'), meta: { auth: true } },
    { path: '/login', name: 'Login', component: () => import('../views/LoginPage.vue') },
  ],
})

router.beforeEach(async (to) => {
  const token = localStorage.getItem('token')
  if (to.meta.auth && !token) return { name: 'Login' }
  return true
})

export default router
