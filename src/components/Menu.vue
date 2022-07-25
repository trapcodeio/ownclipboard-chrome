<template>
  <div class="ocb-chrome-menu">
    <nav class="flex" aria-label="Tabs">
      <router-link exact-active-class="active" :to="{ name: 'local' }" class="menu-link">
        Local
      </router-link>
      <router-link exact-active-class="active" :to="{ name: 'online' }" class="menu-link">
        Online
      </router-link>
      <router-link exact-active-class="active" :to="{ name: 'fav' }" class="menu-link">
        Fav
      </router-link>
      <router-link
        v-if="config?.user.connected"
        exact-active-class="active"
        :to="{ name: 'write' }"
        class="menu-link"
      >
        Write
      </router-link>
      <router-link
        title="Settings"
        v-if="config?.user.connected"
        exact-active-class="active"
        :to="{ name: 'settings' }"
        class="menu-link"
        ><svg
          class="w-5 h-5 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          ></path>
        </svg>
      </router-link>
      <a title="logout" v-if="config?.user.connected" @click.prevent="logout" class="menu-link">
        <svg
          class="w-5 h-5 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          ></path>
        </svg>
      </a>
    </nav>
  </div>
</template>

<script>
import { chromeStore } from "../../package/WebStore";
import config from "../../package/config";
import store from "../store";
import { mapState } from "vuex";
import { tellBackground } from "../frontend";

export default {
  computed: {
    ...mapState(["config"])
  },
  methods: {
    logout() {
      let storeConfig = this.config;

      if (storeConfig.pin.enabled) {
        storeConfig.user.connected = false;
      } else {
        storeConfig = config;
        chromeStore.remove("clips");
      }

      chromeStore.set({ config: storeConfig }, () => {
        store.commit("setConfig", storeConfig);
        tellBackground("stopWatching");
      });
    }
  }
};
</script>

<style lang="scss">
.ocb-chrome-menu {
  @apply ml-1 bg-gray-900 rounded;

  .menu-link.active {
    transition: background-color 0.3s ease-in-out;
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
