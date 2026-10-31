<template>
    <main class="p-2">
        <button
            type="button"
            class="mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-slate-400 transition hover:bg-slate-700/50 hover:text-white"
            @click="goBack"
        >
            <ArrowLeft :size="18" />
            Back
        </button>
        <div v-if="loading" class="py-16 text-center text-slate-400">
            Loading game details...
        </div>

        <div v-else-if="error || !game" class="py-16 text-center">
            <p class="text-red-400">{{ error || 'Game not found.' }}</p>
            <RouterLink to="/" class="mt-4 inline-block text-sky-400 transition hover:text-sky-300">
                Back to Home
            </RouterLink>
        </div>

        <template v-else>
            <section class="mb-4 flex flex-wrap items-center gap-3">
                <h3 class="min-w-0 truncate text-2xl font-bold text-white sm:text-3xl">
                    {{ game.title }}
                </h3>

                <button
                    type="button"
                    :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
                    class="transition duration-200 hover:scale-110"
                    :class="isFavorite ? 'text-red-500' : 'text-slate-400 hover:text-red-400'"
                    @click="isFavorite ? (showConfirmDialog = true, confirmAction = 'favorite') : addToFavorites()"
                >
                    <Heart :size="24" :fill="isFavorite ? 'currentColor' : 'none'" />
                </button>

                <button
                    type="button"
                    :aria-label="inLibrary ? 'Remove from library' : 'Add to library'"
                    class="rounded-lg p-2 transition duration-200 hover:scale-110"
                    :class="inLibrary ? 'text-red-600' : 'text-emerald-400'"
                    @click="inLibrary ? (showConfirmDialog = true, confirmAction = 'library') : addToLibrary()"
                >
                    <ListMinus v-if="inLibrary" :size="24" />
                    <ListPlusIcon v-else :size="24" />
                </button>
            </section>

            <div class="flex flex-col gap-6 md:flex-row">
                <div class="w-full shrink-0 md:w-90">
                    <section class="overflow-hidden rounded-2xl border-2 border-slate-700/60 bg-slate-900">
                        <div class="aspect-3/4 w-full overflow-hidden bg-slate-900">
                            <img
                                v-if="game.cover"
                                :src="game.cover"
                                :alt="game.title"
                                class="h-full w-full object-cover"
                            />
                            <div v-else class="flex h-full w-full items-center justify-center text-slate-500">
                                No image available
                            </div>
                        </div>
                    </section>
                </div>

                <div class="min-w-0 flex-1 space-y-6">
                    <section>
                        <h2 class="mb-2 text-lg font-semibold text-white">Status</h2>
                        <div class="flex flex-wrap gap-3">
                            <button
                                v-for="option in statusOptions"
                                :key="option.value"
                                type="button"
                                class="rounded-full border-2 px-4 py-2 text-sm font-medium transition"
                                :class="userRecord?.status === option.value
                                    ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300'
                                    : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-yellow-400/50'"
                                @click="setStatus(option.value)"
                            >
                                {{ option.label }}
                            </button>
                        </div>
                    </section>

                    <section class="space-y-2 text-slate-300">
                        <p v-if="game.genre">
                            <span class="text-slate-400">Genre:</span> {{ game.genre }}
                        </p>
                        <p v-if="game.releaseDate">
                            <span class="text-slate-400">Release date:</span> {{ game.releaseDate }}
                        </p>
                        <p v-if="game.developer">
                            <span class="text-slate-400">Developer:</span> {{ game.developer }}
                        </p>
                        <p v-if="game.publisher">
                            <span class="text-slate-400">Publisher:</span> {{ game.publisher }}
                        </p>
                        <p v-if="game.description" class="mt-3 leading-relaxed text-slate-300">
                            {{ game.description }}
                        </p>
                        <p v-if="game.genres && game.genres.length" class="mt-2 text-sm text-slate-400">
                            Categories: {{ game.genres.join(', ') }}
                        </p>
                    </section>

                    <section>
                        <p class="mb-2 font-bold text-white">Your Rating</p>
                        <div class="flex items-center gap-2">
                            <button
                                v-for="star in 5"
                                :key="star"
                                type="button"
                                class="text-slate-500 transition hover:scale-110"
                                :class="{ 'text-yellow-400': star <= userRating }"
                                @click="setRating(star)"
                            >
                                <Star :size="28" :fill="star <= userRating ? 'currentColor' : 'none'" />
                            </button>
                        </div>
                    </section>

                    <section class="max-w-2xl">
                        <h2 class="mb-3 text-xl font-semibold text-white">My Notes</h2>
                        <textarea
                            v-model="notesModel"
                            rows="4"
                            placeholder="Write your notes about this game..."
                            class="w-full resize-none rounded-xl border-2 border-slate-700 bg-[#151F32] p-4 text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-400"
                        ></textarea>
                    </section>
                </div>
            </div>
        </template>

        <div
            v-if="showConfirmDialog"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            @click.self="cancelConfirmation"
        >
            <div class="w-full max-w-md rounded-2xl border border-slate-700 bg-[#151F32] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <h2 class="mb-3 text-xl font-bold text-white">
                    {{ confirmAction === 'favorite' ? 'Remove from Favorites?' : 'Remove from Library?' }}
                </h2>

                <p class="mb-6 text-slate-300">
                    {{ confirmAction === 'favorite'
                        ? 'Are you sure you want to remove this game from your favorites?'
                        : 'Are you sure you want to remove this game from your library?' }}
                </p>

                <div class="flex justify-end gap-3">
                    <button
                        type="button"
                        class="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 transition hover:bg-slate-700"
                        @click="cancelConfirmation"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        class="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
                        @click="confirmRemoval"
                    >
                        Confirm Removal
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, ref, watch } from 'vue';
import {
    userGames,
    steamGames,
    searchResults,
    upsertUserGame,
    removeUserGameIfOrphan,
} from '../stores/games.js';
import { getGameDetails } from '../services/steam.js';
import { Star, ArrowLeft } from '@lucide/vue';
import { Heart } from '@lucide/vue';
import { ListPlusIcon } from '@lucide/vue';
import { ListMinus } from '@lucide/vue';

const route = useRoute();
const router = useRouter();

function goBack() {
    if (window.history.length > 1) {
        router.back();
    } else {
        router.push('/');
    }
}

const gameId = computed(() => Number(route.params.id));

const loading = ref(true);
const error = ref('');
const game = ref(null);

const showConfirmDialog = ref(false);
const confirmAction = ref(null);

const statusOptions = [
    { value: 'wantToPlay', label: 'Want to Play' },
    { value: 'playing', label: 'Playing' },
    { value: 'completed', label: 'Completed' },
];

const userRecord = computed(() => userGames.find((g) => g.id === gameId.value));

const inLibrary = computed(() => !!userRecord.value?.inLibrary);
const isFavorite = computed(() => !!userRecord.value?.fav);

const userRating = computed({
    get: () => userRecord.value?.rating ?? 0,
    set: (value) => {
        const record = upsertUserGame(game.value);
        if (record) {
            record.rating = value;
        }
    },
});

const notesModel = computed({
    get: () => userRecord.value?.notes ?? '',
    set: (value) => {
        const record = upsertUserGame(game.value);
        if (record) {
            record.notes = value;
        }
    },
});

async function resolveGame() {
    loading.value = true;
    error.value = '';
    game.value = null;

    const id = gameId.value;
    if (!Number.isFinite(id)) {
        error.value = 'Invalid game ID.';
        loading.value = false;
        return;
    }

    let found = userGames.find((g) => g.id === id);
    if (found) {
        game.value = found;
        loading.value = false;
        return;
    }

    found = steamGames.find((g) => g.id === id);
    if (found) {
        game.value = { ...found };
        loading.value = false;
        return;
    }

    found = searchResults.find((g) => g.id === id);
    if (found) {
        game.value = { ...found };
        loading.value = false;
        return;
    }

    try {
        const details = await getGameDetails(id);
        if (!details) {
            error.value = 'Game not found.';
        } else {
            game.value = details;
        }
    } catch (err) {
        error.value = 'Failed to load game details.';
        console.error(err);
    } finally {
        loading.value = false;
    }
}

onMounted(resolveGame);
watch(gameId, resolveGame);

function addToLibrary() {
    const record = upsertUserGame(game.value);
    if (record) {
        record.inLibrary = true;
        if (record.status == null) {
            record.status = 'wantToPlay';
        }
    }
}

function addToFavorites() {
    const record = upsertUserGame(game.value);
    if (record) {
        record.fav = true;
    }
}

function setStatus(status) {
    const record = upsertUserGame(game.value);
    if (record) {
        record.status = status;
        if (!record.inLibrary && !record.fav) {
            record.inLibrary = true;
        }
    }
}

function setRating(value) {
    const record = upsertUserGame(game.value);
    if (record) {
        record.rating = value;
    }
}

function cancelConfirmation() {
    showConfirmDialog.value = false;
    confirmAction.value = null;
}

function confirmRemoval() {
    if (confirmAction.value === 'favorite' && userRecord.value) {
        userRecord.value.fav = false;
        removeUserGameIfOrphan(gameId.value);
    }

    if (confirmAction.value === 'library' && userRecord.value) {
        userRecord.value.inLibrary = false;
        removeUserGameIfOrphan(gameId.value);
    }

    cancelConfirmation();
}
</script>
