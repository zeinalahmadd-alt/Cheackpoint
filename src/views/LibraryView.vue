<script setup>
import { userGames } from '../stores/games.js';
import GameCard from '../components/GameCard.vue';
import { computed, inject } from 'vue';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const sidebarCollapsed = inject('sidebarCollapsed', ref(false));

const libraryGames = computed(() => {
    const seen = new Set();
    return userGames.filter((game) => {
        if (!game.inLibrary) return false;
        if (seen.has(game.id)) return false;
        seen.add(game.id);
        return true;
    });
});

const gridClass = computed(() =>
    sidebarCollapsed.value
        ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
        : 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
);
</script>

<template>
    <section class="p-2">
        <div v-if="libraryGames.length > 0" :class="gridClass">
            <GameCard v-for="game in libraryGames" :key="game.id" :game="game" />
        </div>
        <div v-else class="py-16 text-center">
            <p class="text-lg text-slate-400">
                You haven't added any games to your library yet.
            </p>
            <RouterLink to="/" class="mt-4 inline-block text-sky-400 transition hover:text-sky-300">
                Back to Home
            </RouterLink>
        </div>
    </section>
</template>