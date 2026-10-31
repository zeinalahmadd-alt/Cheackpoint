<script setup>
import { userGames } from '../stores/games.js';
import { computed } from 'vue';
import { Gamepad2, CircleCheck, Clock, Bookmark } from '@lucide/vue';

const libraryGames = computed(() => {
    const seen = new Set();
    return userGames.filter((game) => {
        if (!game.inLibrary) return false;
        if (seen.has(game.id)) return false;
        seen.add(game.id);
        return true;
    });
});

const totalGames = computed(() => libraryGames.value.length);
const completedGames = computed(() =>
    libraryGames.value.filter((game) => game.status === 'completed').length
);
const playingGames = computed(() =>
    libraryGames.value.filter((game) => game.status === 'playing').length
);
const wantToPlayGames = computed(() =>
    libraryGames.value.filter((game) => game.status === 'wantToPlay').length
);

const cards = computed(() => [
    {
        label: 'Total Games',
        value: totalGames.value,
        color: 'text-sky-400',
        icon: Gamepad2,
    },
    {
        label: 'Completed',
        value: completedGames.value,
        color: 'text-emerald-400',
        icon: CircleCheck,
    },
    {
        label: 'Playing Now',
        value: playingGames.value,
        color: 'text-amber-400',
        icon: Clock,
    },
    {
        label: 'Want To Play',
        value: wantToPlayGames.value,
        color: 'text-violet-400',
        icon: Bookmark,
    },
]);
</script>

<template>
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article v-for="card in cards" :key="card.label" class="rounded-2xl border 
        border-slate-700/60 
        bg-slate-800/60 p-5 transition duration-300 
        hover:border-sky-400/50 hover:bg-slate-800">
            <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-slate-400">
                    {{ card.label }}
                </p>

                <component :is="card.icon" :size="22" :class="card.color" />
            </div>

            <h2 class="mt-3 text-3xl font-bold tracking-tight" :class="card.color">
                {{ card.value }}
            </h2>
        </article>
    </section>
</template>