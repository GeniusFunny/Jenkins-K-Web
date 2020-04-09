import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    {
      exact: false,
      path: '/',
      component: '@/layouts/index',
      routes: [
        { exact: true, path: '/', component: '@/pages/management' },
        { exact: true, path: '/views', component: '@/pages/views' },
        { exact: true, path: '/jobs', component: '@/pages/jobs' },
        { exact: true, path: '/management', component: '@/pages/management' },
        {
          exact: true,
          path: '/newDeployment',
          component: '@/pages/newDeployment',
        },
      ],
    },
    {
      exact: false,
      path: '/login',
      component: '@/layouts/LoginLayout',
      routes: [
        { exact: true, path: '/login', component: '@/pages/login' },
        {
          exact: true,
          path: '/logout',
          redirect: '/login',
          component: '@/pages/login',
        },
      ],
    },
  ],
});
