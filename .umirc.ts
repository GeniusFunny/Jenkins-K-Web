import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    {
      exact: false,
      path: '/',
      component: '@/layouts/index',
      routes: [
        { exact: true, path: '/', component: '@/pages/index' },
        { exact: true, path: '/job', component: '@/pages/job' },
      ],
    },
  ],
});
