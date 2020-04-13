import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    {
      exact: false,
      path: '/',
      component: '@/layouts/index',
      routes: [
        { exact: true, path: '/', component: '@/pages/deployments' },
        { exact: true, path: '/views', component: '@/pages/views' },
        { exact: true, path: '/jobs', component: '@/pages/jobs' },
        { exact: true, path: '/newJob', component: '@/pages/newJob' },
        { exact: true, path: '/editJob', component: '@/pages/editJob' },
        { exact: true, path: '/deployments', component: '@/pages/deployments' },
        { exact: true, path: '/deploy', component: '@/pages/deploy' },
        {
          exact: true,
          path: '/newDeployment',
          component: '@/pages/newDeployment',
        },
      ],
    },
  ],
});
