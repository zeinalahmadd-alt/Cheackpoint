<template>
    <div class="min-h-135 w-full">
        <nav class="flex w-full flex-col gap-2">
            <div class="mb-2 flex items-center " :class="isSidebarCollapsed ? 'justify-center' : 'justify-between'">
                <p v-if="showLabels" class="text-slate-400">
                    PLAYER MENU
                </p>

                <button @click="$emit('toggle-sidebar')"
                    class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-700/50 hover:text-white"
                    aria-label="Toggle sidebar">
                    <PanelLeftClose v-if="!isSidebarCollapsed" :size="20" />
                    <PanelLeftOpen v-else :size="20" />
                </button>
            </div>
            <RouterLink to="/"
                class="flex items-center gap-3 rounded-lg py-3 text-slate-400 transition hover:bg-slate-700/50 hover:text-white"
                :class="[
                    isSidebarCollapsed ? 'justify-center px-2' : 'px-4',
                    $route.path === '/' ? 'bg-[#216bb5] text-white' : ''
                ]" exact-active-class="bg-[#216bb5] text-white">

                <House :size="20" />

                <Transition name="label">
                    <span v-if="showLabels" class="whitespace-nowrap">
                        Home
                    </span>
                </Transition>
            </RouterLink>

            <RouterLink to="/library"
                class="flex items-center gap-3 rounded-lg py-3 text-slate-400 transition hover:bg-slate-700/50 hover:text-white"
                :class="[
                    isSidebarCollapsed ? 'justify-center px-2' : 'px-4',
                ]" active-class="bg-[#216bb5] text-white">
                <LibraryBig :size="20" />
                <Transition name="label">
                    <span v-if="showLabels" class="whitespace-nowrap">
                        Library
                    </span>
                </Transition>
            </RouterLink>

            <RouterLink to="/favorites"
                class="flex items-center gap-3 rounded-lg py-3 text-slate-400 transition hover:bg-slate-700/50 hover:text-white"
                :class="[
                    isSidebarCollapsed ? 'justify-center px-2' : 'px-4',
                ]" active-class="bg-[#216bb5] text-white">
                <Heart :size="20" />
                <Transition name="label">
                    <span v-if="showLabels" class="whitespace-nowrap">
                        Favorites
                    </span>
                </Transition>
            </RouterLink>

            <!-- <RouterLink to="/gaming-journal"
                class="flex items-center gap-3 rounded-lg py-3 text-slate-400 transition hover:bg-slate-700/50 hover:text-white"
                :class="[
                    isSidebarCollapsed ? 'justify-center px-2' : 'px-4',
                ]" active-class="bg-[#216bb5] text-white">
                <Footprints :size="20" />
                <Transition name="label">
                    <span v-if="showLabels" class="whitespace-nowrap">
                        Gaming Journal
                    </span>
                </Transition>
            </RouterLink> -->
        </nav>
    </div>
    <!-- <section class="mt-auto w-full flex flex-row items-center justify-center  gap-3 ">
        <div>
            <button class="rounded-full px-3 py-3 text-slate-400 
                transition hover:bg-slate-700/50 
                hover:text-[#0B1120]
                flex items-center gap-3"
                active-class="bg-[#216bb5] text-white">
                <Power :size="30" />
            </button>
        </div>
        <div>    
            <button class="rounded-full px-3 py-3 text-slate-400 
                transition hover:bg-slate-700/50
                hover:text-[#0B1120]
                flex items-center gap-3"
                active-class="bg-[#216bb5] text-white">
                <SunMoon :size="30"/>
            </button>
            <line :size="20" />
        </div>
    </section> -->
</template>

<script setup>
import { House } from '@lucide/vue';
import { LibraryBig } from '@lucide/vue';
import { Heart } from '@lucide/vue';
import { PanelLeftClose, PanelLeftOpen } from '@lucide/vue';

const props = defineProps({
    isSidebarCollapsed: Boolean,
    showLabels: Boolean,
});
const emit = defineEmits(['toggle-sidebar']);
</script>

<style>
</style>