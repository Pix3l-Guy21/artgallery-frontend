import { createRouter, createWebHistory } from "vue-router";

import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Artist from '../views/Artists.vue';
import Artwork from '../views/Artworks.vue';
import Profile from '../views/Profile.vue';
import Login from "../views/Login.vue";
import PageNotFound from "../views/PageNotFound.vue";
import Signup from "../views/Signup.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        component: About
    },
    {
        path: '/artworks',
        name: 'Artworks',
        component: Artwork
    },
    {
        path: '/artists',
        name: 'Artists',
        component: Artist
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup
    },
    {
        path: '/:catchAll(.*)',
        name: 'PageNotFound',
        component: PageNotFound
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;