<template>
  <section class="ocb-chrome" v-if="loaded && config">
    <h3 v-if="!config.user.connected" class="text-center mt-5 text-2xl tracking-wide">
      {{ config.appName }}
    </h3>
    <template v-if="config.user.connected">
      <!-- Menu -->
      <div class="mx-1 mt-2 mb-3">
        <Menu class="float-left" />
        <div class="clear-both"></div>
      </div>

      <!-- Router View -->
      <router-view />
    </template>
    <template v-else>
      <div class="grid grid-cols-1 mt-10">
        <div class="col-span-1">
          <Login />
        </div>
      </div>
    </template>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import store from "./store";
import { chromeStore, localStore } from "../package/WebStore";
import chromeAppConfig from "../package/config";
import Login from "./components/Login.vue";
import Menu from "./components/Menu.vue";
import { isDev, tellBackground } from "./frontend";
import { useRoute } from "vue-router";

const $route = useRoute();
let loaded = ref(false);
const $config = ref<any>({
  user: { connected: false }
});

// Mock getting config
if (isDev) {
  if (localStore.has("config")) {
    // noinspection JSValidateTypes
    $config.value = localStore.getObject("config", chromeAppConfig as any);
  } else {
    localStore.setObject("config", chromeAppConfig);
    $config.value = chromeAppConfig;
  }

  loaded.value = true;
  store.commit("setConfig", $config.value);
} else {
  chromeStore.get("config").then((data) => {
    console.log("Config from chrome store", data);
    if (data) {
      $config.value = data;
      store.commit("setConfig", data);
    }

    tellBackground("checkDaemon");

    loaded.value = true;
  });
}

// Vue 3 Setup
const config = computed(() => store.state.config);

watch(
  () => $route.name,
  () => {
    console.log("Route changed to", $route.name);
  },
  { immediate: true }
);

function setClipsWidth() {
  // const
}
</script>
