<script setup>
import { ref, provide } from 'vue';
import Navbar from '../components/Navbar.vue';
import { useRoute } from 'vue-router';
import { House, LibraryBig, Heart } from '@lucide/vue';

const route = useRoute();
const isSidebarCollapsed = ref(true);
const showlabels = ref(false);

provide('sidebarCollapsed', isSidebarCollapsed);
</script>

<template>
    <main class="flex h-screen flex-col overflow-hidden bg-[#0B1120] px-4 py-4 text-slate-100 sm:px-6 sm:py-6">

        <!-- Header -->
        <header class="mb-4 flex items-center justify-between gap-3">
            <div class="min-w-0">
                <h1 class="text-2xl text-[#216bb5] sm:text-3xl">Checkpoint</h1>
                <div class="flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-4">
                    <h2 class="truncate text-2xl text-[#94a3b8] sm:text-4xl">
                        {{ route.meta.title }}
                    </h2>
                    <p class="hidden text-sm text-slate-500 sm:block">
                        Your games are here, that is, they are safe.
                    </p>
                </div>
            </div>

            <img src="/appicon.svg" alt="Checkpoint Logo" class="h-10 w-10 shrink-0 sm:h-16 sm:w-16">
        </header>

        <hr class="mb-4 border-2 border-[#216bb5]">

        <!-- Sidebar + Page Content -->
        <div class="flex min-h-0 flex-1 gap-4 sm:gap-6">
            <aside
                class="hidden h-fit shrink-0 rounded-2xl border border-slate-700/60 bg-[#151F32] p-4 transition-[width] duration-300 ease-in-out md:block"
                @transitionend="!isSidebarCollapsed && (showlabels = true)"
                :class="isSidebarCollapsed ? 'w-20' : 'w-60'"
            >
                <Navbar
                    :is-sidebar-collapsed="isSidebarCollapsed"
                    :show-labels="showlabels"
                    @toggle-sidebar="isSidebarCollapsed = isSidebarCollapsed ? (isSidebarCollapsed = false) : (showlabels = false, isSidebarCollapsed = true)"
                />
            </aside>

            <div class="min-w-0 flex-1 overflow-y-auto pr-1 sm:pr-2 pb-24 md:pb-0">
                <RouterView />
            </div>
        </div>

        <!-- Mobile bottom navigation -->
        <nav class="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-700/60 bg-[#151F32]/95 backdrop-blur md:hidden pb-[env(safe-area-inset-bottom)]">
            <div class="flex items-center justify-around py-2">
                <RouterLink to="/" class="flex flex-col items-center gap-1 px-4 py-2 text-slate-400 transition hover:text-white" active-class="text-sky-400">
                    <House :size="22" />
                </RouterLink>
                <RouterLink to="/library" class="flex flex-col items-center gap-1 px-4 py-2 text-slate-400 transition hover:text-white" active-class="text-sky-400">
                    <LibraryBig :size="22" />
                </RouterLink>
                <RouterLink to="/favorites" class="flex flex-col items-center gap-1 px-4 py-2 text-slate-400 transition hover:text-white" active-class="text-sky-400">
                    <Heart :size="22" />
                </RouterLink>
            </div>
        </nav>
    </main>
</template>