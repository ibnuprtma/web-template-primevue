import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

const routes = [
    {
        path: '/dashboard',
        name: 'app',
        component: App,
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('./pages/Dashboard.vue')
            },
            {
                path: '/empty',
                name: 'empty',
                component: () => import('./pages/EmptyPage.vue')
            },
            {
                path: '/example-page',
                name: 'example-page',
                component: () => import('./pages/ExamplePage.vue')
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('./pages/Login.vue')
    },
    {
        path: '/error',
        name: 'error',
        component: () => import('./pages/Error.vue')
    },
    {
        path: '/access',
        name: 'access',
        component: () => import('./pages/Access.vue')
    },
    {
        path: '/',
        redirect: '/dashboard'
    },
    {  
        path: "/:catchAll(.*)",
        name: "NotFound",
        component: () => import('./pages/NotFound.vue')
    },  
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && !localStorage.getItem("authToken")) {
      next({ name: 'login' });
    }else if(to.name === 'login' && localStorage.getItem("authToken")){
        next({ name: 'dashboard' });
    }else {
      next();
    }
});

export default router;
