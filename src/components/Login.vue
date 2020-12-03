<template>
  <form @submit="()=>false" class="ocb-chrome-login-form">
    <template v-if="config.pin.enabled">
      <EnterPin :on-success="onPinSuccess"/>
    </template>
    <template v-else>
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
    </template>
  </form>
</template>

<script>
import {computed, ref} from 'vue';
import store from '../store/index';
import http from '../../package/http';
import {chromeStore} from '../../package/WebStore';
import {tellBackground} from '@/frontend';
import EnterPin from '@/components/EnterPin';

function setup() {
  const config = computed(() => store.state.config);

  let form = ref({
    host: config.value['defaultApiHost'],
    apiKey: null,
  });

  const onClickLogin = (btn) => {
    http.post('connect', {api_key: form.value.apiKey}).then(data => {
      let newConfig = JSON.parse(JSON.stringify(config.value));

      newConfig.user.key = data['api_key'];
      newConfig.user.connected = true;
      newConfig.user.connectedData = data;
      newConfig.clips.watch = true;

      chromeStore.set({config: newConfig});
      store.commit('setConfig', newConfig);

      // Start watching...
      tellBackground('startWatch');
    }).catch(err => err).finally(() => btn.stopLoading());
  };

  return {form, onClickLogin, config};
}

export default {
  components: {EnterPin},
  setup,
  name: 'Login',
  methods: {
    onPinSuccess() {
      const newConfig = this.config;
      newConfig.user.connected = true;
      chromeStore.set({config: newConfig}, () => {
        store.commit('setConfig', newConfig);
      });
    },
  },
};
</script>