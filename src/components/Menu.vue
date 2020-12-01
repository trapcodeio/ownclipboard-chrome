<template>
  <div class="ocb-chrome-menu">
    <nav class="flex" aria-label="Tabs">
      <router-link exact-active-class="active" :to="{name: 'local'}" class="menu-link">
        Local
      </router-link>
      <router-link exact-active-class="active" :to="{name: 'online'}" class="menu-link">
        Online
      </router-link>
<!--      <a href="#" class="menu-link">-->
<!--        Settings-->
<!--      </a>-->
      <a @click.prevent="logout" class="menu-link">
        <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
      </a>
    </nav>
  </div>
</template>

<script>
import {chromeStore} from "../../package/WebStore";
import config from "../../package/config";
import store from "@/store";

export default {
  methods: {
    logout() {
      chromeStore.remove('clips');
      chromeStore.set({config});
      store.commit('setConfig', config);
    }
  }
}
</script>

<style lang="scss">
.ocb-chrome-menu {
  @apply ml-1 bg-gray-900 rounded;

  .menu-link.active {
    @apply font-medium bg-green-800;
  }

  .menu-link {
    @apply px-3 py-2 text-sm rounded-sm text-gray-300 cursor-pointer;

    &:hover:not(.active) {
      @apply text-green-500;
    }
  }
}
</style>