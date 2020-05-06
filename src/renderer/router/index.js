import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login'
/*import NewQT from '@/views/NewQT'
import NewNewQT from '@/views/NewNewQT'
import NewNewNewQT from '@/views/NewNewNewQT'
import Chat from '@/views/Chat'
import UserInfo from '@/views/UserInfo'*/
import MainPage from '@/views/MainPage'
/*import NewQTList from '@/views/NewQTList'*/

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/MainPage',
        name: 'MainPage',
        component: MainPage
    }
]

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