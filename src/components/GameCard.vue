<script setup>
import { RouterLink } from 'vue-router';
import { computed } from 'vue';
import { Plus, Check, Heart } from '@lucide/vue';
import { userGames, upsertUserGame } from '../stores/games.js';

const props = defineProps({
    game: {
        type: Object,
        required: true,
    },
});

const statusLabels = {
    playing: 'Playing',
    completed: 'Completed',
    wantToPlay: 'Want to Play',
};

const isInLibrary = computed(() => {
    const record = userGames.find((g) => g.id === props.game.id);
    return !!record?.inLibrary;
});

const isFavorite = computed(() => {
    const record = userGames.find((g) => g.id === props.game.id);
    return !!record?.fav;
});

function addToLibrary(event) {
    event.preventDefault();
    event.stopPropagation();

    if (isInLibrary.value) {
        return;
    }

    const record = upsertUserGame(props.game);
    if (record) {
        record.inLibrary = true;
        if (record.status == null) {
            record.status = 'wantToPlay';
        }
    }
}
</script>

<template>
    <RouterLink :to="`/game/${game.id}`">
        <article class="group overflow-hidden rounded-2xl border-3 border-slate-700/60 bg-slate-800/60 
        transition duration-300 hover:-translate-y-1 hover:border-sky-400/50 ">
            <div class="relative aspect-3/4 overflow-hidden bg-slate-900">
                <img :src="game.cover" :alt="game.title"
                    class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <Heart
                    class="pointer-events-none absolute left-2 top-2"
                    :size="18"
                    :fill="isFavorite ? 'currentColor' : 'none'"
                    :class="isFavorite ? 'text-red-500 drop-shadow' : 'text-slate-300/80'"
                />
            </div>
            <div class="p-3">
                <h3 class="truncate text-lg font-bold text-white">
                    {{ game.title }}
                </h3>
                <p class="mt-1 text-sm text-slate-400">
                    {{ game.genre }}
                </p>

                <div class="mt-4 flex items-center justify-between gap-2">
                    <span
                        v-if="game.status"
                        class="inline-block rounded-full bg-slate-700/70 px-3 py-1 text-xs font-medium text-sky-300"
                    >
                        {{ statusLabels[game.status] }}
                    </span>
                    <span v-else></span>

                    <button
                        type="button"
                        class="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition"
                        :class="isInLibrary
                            ? 'bg-emerald-500/20 text-emerald-300 cursor-default'
                            : 'bg-[#216bb5] text-white hover:bg-[#1d5a9a]'"
                        :disabled="isInLibrary"
                        @click.stop.prevent="addToLibrary"
                    >
                        <Check v-if="isInLibrary" :size="14" />
                        <Plus v-else :size="14" />
                        {{ isInLibrary ? 'In Library' : 'Add to Library' }}
                    </button>
                </div>
            </div>
        </article>
    </RouterLink>
</template>
