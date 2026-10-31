<template>
    <div>
        <!-- Search -->
        <div class="relative m-0.5">
            <Search :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search games..."
                class="w-full rounded-xl bg-[#151F32] py-3 pl-12 pr-12 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                @keydown.enter.prevent="submitSearch"
            />

            <button
                v-if="searchQuery"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:text-white"
                aria-label="Clear search"
                @click="clearSearch"
            >
                <X :size="18" />
            </button>
        </div>

        <!-- Your journey -->
        <div class="my-2">
            <p class="text-2xl text-sky-400 my-2">Your gaming journey</p>
            <p class="text-slate-400">Keep track of what you played, finished, and want to try.</p>
        </div>

        <!-- Statistics -->
        <StatsCards class="mb-5" />

        <!-- Search Results -->
        <section v-if="hasSearched || searchLoading || searchError" class="mb-8">
            <div class="mb-5 flex items-center justify-between gap-3">
                <h2 class="text-2xl font-bold text-white">Search Results</h2>
                <button
                    type="button"
                    class="text-sm font-medium text-sky-400 transition hover:text-sky-300"
                    @click="clearSearch"
                >
                    Back to popular games
                </button>
            </div>

            <p v-if="searchLoading" class="text-slate-400">Searching games...</p>
            <p v-else-if="searchError" class="text-red-400">{{ searchError }}</p>
            <p v-else-if="searchResults.length === 0" class="text-slate-400">
                No games found. Try a different search.
            </p>
            <div v-else :class="gridClass">
                <GameCard v-for="game in searchResults" :key="game.id" :game="game" />
            </div>
        </section>

        <!-- Popular Games -->
        <section v-else>
            <div class="mb-5 flex items-center justify-between">
                <h2 class="text-2xl font-bold text-white">Popular Games</h2>
            </div>

            <div :class="gridClass">
                <p v-if="loading" class="text-slate-400">Loading games...</p>
                <p v-else-if="error" class="text-red-400">{{ error }}</p>
                <template v-else>
                    <GameCard v-for="game in steamGames" :key="game.id" :game="game" />
                </template>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from 'vue';
import StatsCards from '../components/StatsCards.vue';
import GameCard from '../components/GameCard.vue';
import { Search, X } from '@lucide/vue';
import { getPopularGames, searchGames } from '../services/steam.js';
import {
    steamGames,
    searchResults,
    popularGamesLoaded,
    popularGamesLoading,
} from '../stores/games.js';

const loading = ref(false);
const error = ref('');

const searchQuery = ref('');
const searchLoading = ref(false);
const searchError = ref('');
const hasSearched = ref(searchResults.length > 0);
let lastSubmittedQuery = searchResults.length > 0 ? '__restored__' : '';

const sidebarCollapsed = inject('sidebarCollapsed', ref(false));
const gridClass = computed(() =>
    sidebarCollapsed.value
        ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
        : 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
);

onMounted(async () => {
    if (popularGamesLoaded.value || popularGamesLoading.value) {
        return;
    }

    popularGamesLoading.value = true;
    loading.value = true;

    try {
        const results = await getPopularGames();
        steamGames.splice(0, steamGames.length, ...results);
        popularGamesLoaded.value = true;
    } catch (err) {
        error.value = 'Failed to load games';
        console.error(err);
    } finally {
        popularGamesLoading.value = false;
        loading.value = false;
    }
});

async function submitSearch() {
    if (searchLoading.value) {
        return;
    }

    const query = searchQuery.value.trim();
    if (!query) {
        return;
    }

    // Avoid duplicate requests for the exact same submitted query.
    if (query === lastSubmittedQuery && hasSearched.value && !searchError.value) {
        return;
    }

    searchLoading.value = true;
    searchError.value = '';

    try {
        const results = await searchGames(query);
        searchResults.splice(0, searchResults.length, ...results);
        hasSearched.value = true;
        lastSubmittedQuery = query;
    } catch (err) {
        searchError.value = 'Failed to search games. Please try again.';
        console.error(err);
    } finally {
        searchLoading.value = false;
    }
}

function clearSearch() {
    searchQuery.value = '';
    searchError.value = '';
    hasSearched.value = false;
    lastSubmittedQuery = '';
    searchResults.splice(0, searchResults.length);
}
</script>

