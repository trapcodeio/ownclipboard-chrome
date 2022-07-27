<template>
  <form @submit="() => false" class="ocb-chrome-login-form">
    <template v-if="config.pin.enabled">
      <EnterPin :on-success="onPinSuccess" />
    </template>
    <template v-else>
      <div class="field">
        <label>Host:</label>
        <div class="control">
          <input type="text" v-model="form.host" :placeholder="`e.g ${config.defaultApiHost}`" />
        </div>
      </div>

      <div class="field">
        <label>Api Key:</label>
        <div class="control">
          <input type="text" v-model="form.apiKey" placeholder="Your Api Key" />
        </div>
      </div>
      <div class="mt-3">
        <LoadingButton :click="onClickLogin" class="bg-green-600 hover:bg-green-700"
          >Connect
        </LoadingButton>
      </div>
    </template>
  </form>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import store from "../store";
import http, { axios, setupHttp } from "../../package/http";
import { chromeStore } from "../../package/WebStore";
import { tellBackground, TEST_API_KEY, TEST_HOST } from "../frontend";
import EnterPin from "../components/EnterPin.vue";
import { ifDev } from "revue-components/vue3/utils";

import { ILoadingButton } from "revue-components/vues/component-types";
import { Config, ConnectedResponse } from "../../package/config";
import { copyObjectUsingJson } from "../../package/functions/lean.fn";

const config = computed(() => store.state.config as Config);

let form = ref({
  // host:
  host: ifDev(TEST_HOST, config.value["customApiHost"] || config.value["defaultApiHost"]),
  apiKey: ifDev(TEST_API_KEY)
});

const onClickLogin = async (btn: ILoadingButton) => {
  if (!form.value.host || !form.value.apiKey) return btn.stopLoading();

  const url = new URL(form.value.host);
  url.pathname = "/api";

  try {
    // check url
    await axios.post(url.href + "/validate");

    // Update Config
    const $config: Config = copyObjectUsingJson(config.value);
    $config["customApiHost"] = url.origin;

    // Commit Config
    await chromeStore.setAsync({ config: $config });
    store.commit("setConfig", $config);

    // save key and set apiKey
    setupHttp($config, form.value.apiKey);
  } catch (e) {
    return;
  }

  http
    .post<any, ConnectedResponse>("connect")
    .then(async (data) => {
      let newConfig = copyObjectUsingJson(config.value);

      newConfig.user.key = data.api_key;
      newConfig.user.connected = true;
      newConfig.user.connectedData = data;
      newConfig.clips.watch = true;

      await chromeStore.setAsync({ config: newConfig });
      store.commit("setConfig", newConfig);

      // Start watching...
      tellBackground("startWatch");
    })
    .catch((err) => err)
    .finally(() => btn.stopLoading());
};

function onPinSuccess() {
  let newConfig = copyObjectUsingJson(config.value);
  newConfig.user.connected = true;

  // update config.
  chromeStore.set({ config: newConfig }, () => {
    store.commit("setConfig", newConfig);
  });
}
</script>
