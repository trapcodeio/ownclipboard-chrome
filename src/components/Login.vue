<template>
  <form @submit="()=>false" class="ocb-chrome-login-form">
    <div class="field">
      <label>Host:</label>
      <div class="control">
        <input type="text" v-model="form.host" :placeholder="`e.g ${config.defaultApiHost}`">
      </div>
    </div>

    <div class="field">
      <label>Api Key:</label>
      <div class="control">
        <input type="text" v-model="form.apiKey" placeholder="Your Api Key">
      </div>
    </div>
    <div class="mt-3">
      <LoadingButton :click="onClickLogin" class="bg-green-600  hover:bg-green-700">Connect</LoadingButton>
    </div>
  </form>
</template>

<script>
import {computed, ref} from "vue";
import store from "../store/index";
import http from "../../package/http";
import LoadingButton from "@/components/LoadingButton";
import {chromeStore} from "../../package/WebStore";

function setup() {
  const config = computed(() => store.state.config)

  let form = ref({
    host: config.value['defaultApiHost'],
    apiKey: config.value['user']['key'],
  });



  const onClickLogin = (btn) => {
    http.post('connect', {api_key: form.value.apiKey})
        .then(data => {
          let newConfig = JSON.parse(JSON.stringify(config.value));
          newConfig.user.connected = true;
          newConfig.user.connectedData = data
          chromeStore.set({config: newConfig});
          store.commit('setConfig', newConfig);
        })
        // .catch(err => err)
        .finally(() => btn.stopLoading());
  };


  return {form, onClickLogin, config}
}

export default {
  components: {LoadingButton},
  setup,
  name: 'Login',
}
</script>

<style lang="scss" scoped>
.ocb-chrome-login-form {
  @apply px-10;

  .control {
    @apply block;

    input {
      @apply bg-gray-900 rounded w-full;
      @apply focus:outline-none focus:ring-gray-500 focus:border-gray-500
    }
  }

  .field {
    @apply my-3;
  }
}
</style>