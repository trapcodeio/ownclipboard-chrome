<template>
  <section v-if="loaded && config">
    <h3 v-if="!config.user.connected" class="text-center mt-5 text-2xl">{{ config.appName }}</h3>

    <template v-if="config.user.connected">
      <router-view/>
    </template>
    <template v-else>
      <div class="grid grid-cols-1 mt-10">
        <div class="col-span-1">
          <Login/>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
import {computed, ref} from "vue"
import store from "./store/index";
import {chromeStore, localStore} from "../package/WebStore";
import chromeAppConfig from "../package/config";
import Login from "@/components/Login";
import Busy from "@/components/Busy";
import Dashboard from "@/Dashboard";

const isDev = process.env.NODE_ENV === 'development';

// Vue 3 Setup
function setup() {
  const config = ref({
    user: {connected: false}
  });

  let loaded = ref(false);

  // Mock getting config
  if (isDev) {
    if (localStore.has('config')) {
      config.value = localStore.getObject('config', chromeAppConfig);
    } else {
      localStore.setObject('config', chromeAppConfig);
      config.value = chromeAppConfig;
    }

    loaded.value = true;
    store.commit('setConfig', config.value);
  } else {
    chromeStore.get('config').then(data => {
      if (data) {
        config.value = data
        store.commit('setConfig', data);
      }

      loaded.value = true;
    })
  }

  return {config: computed(() => store.state.config), loaded};
}

export default {
  name: 'App',
  components: {Dashboard, Busy, Login},
  setup
}
</script>