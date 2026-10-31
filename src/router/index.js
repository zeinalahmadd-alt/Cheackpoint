import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '../Layouts/MainLayout.vue'

import HomeView from '../views/HomeView.vue'
import LibraryView from '../views/LibraryView.vue'
import GameDetailsView from '../views/GameDetailsView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import GamingJournalView from '../views/GamingJournalView.vue'

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'Home',
                component: HomeView,
                meta: { title: 'Home' },
            },
            {
                path: 'library',
                name: 'Library',
                component: LibraryView,
                meta: { title: 'My Library' },
            },
            {
                path: 'game/:id',
                name: 'GameDetails',
                component: GameDetailsView,
                meta: { title: 'Game Details' },
            },
            {
                path: 'favorites',
                name: 'Favorites',
                component: FavoritesView,
                meta: { title: 'My Favorites' },
            },
            {
                path: 'gaming-journal',
                name: 'GamingJournal',
                component: GamingJournalView,
                meta: { title: 'Your Journal' },
            },
            {
                path: ':pathMatch(.*)*',
                redirect: '/',
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router