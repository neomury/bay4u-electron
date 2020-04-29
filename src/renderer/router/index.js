import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Login',
    component: Login
}]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
export default router
/*export default new VueRouter({
    routes: [{
            path: '/',
            name: 'landing-page',
            component: require('@/components/LandingPage').default
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})*/