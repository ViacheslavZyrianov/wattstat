export default [
  {
    path: '/',
    name: 'Home',
    meta: { layout: 'CenteredLayout' },
    component: () => import('@/views/Home/Index.vue'),
  },
  {
    path: '/auth',
    name: 'Auth',
    meta: { layout: 'CenteredLayout' },
    component: () => import('@/views/Auth/Index.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard/Index.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile/Index.vue'),
  },
  {
    path: '/readings',
    name: 'Readings',
    component: () => import('@/views/Readings/Index.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings/Index.vue'),
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    meta: { layout: 'FullPageLayout' },
    component: () => import('@/views/PrivacyPolicy/Index.vue'),
  },
  {
    path: '/terms-of-service',
    name: 'TermsOfService',
    meta: { layout: 'FullPageLayout' },
    component: () => import('@/views/TermsOfService/Index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: { layout: 'CenteredLayout' },
    component: () => import('@/views/NotFound/Index.vue'),
  },
]
