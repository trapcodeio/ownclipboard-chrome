<template>
  <div class="ocb-chrome-settings p-3">
    <template v-if="!config.pin.enabled || (config.pin.enabled && pinAuth)">
      <div class="mt-5 space-y-3">
        <div class="form">
          <span class="float-left text-green-400 text-sm">Auto Watch</span>
          <div class="float-right">
            <Toggle v-model="form.clips.watch" />
          </div>
          <div class="clear-both"></div>
          <p class="help text-sm text-gray-400">
            If disabled, OwnClipboard won't watch your local clipboard for changes. You only get to
            see the current item in your clipboard but not all items copied while auto watch is
            disabled.
          </p>
        </div>

        <div class="form">
          <div class="grid grid-cols-2">
            <div class="col-span-1">
              <label class="text-green-400 text-sm">Watch Interval</label>
              <select
                v-model="form.clips.interval"
                class="mt-1 block bg-gray-900 text-gray-200 pl-3 pr-10 py-2 text-base border-gray-800 focus:outline-none focus:ring-gray-800 focus:border-gray-800 sm:text-sm rounded-md"
              >
                <option v-for="interval in intervals" :value="interval">
                  <template v-if="interval === 2">RealTime</template>
                  <template v-else-if="interval === 60">Every 1 minute</template>
                  <template v-else>Every {{ interval }} seconds</template>
                </option>
              </select>
            </div>
            <div class="col-span-1">
              <label class="block text-green-400 text-sm mt-1">Local Clips Max Storage.</label>
              <input
                v-model="form.perPage.local"
                type="number"
                min="10"
                max="250"
                class="text-white w-32 bg-gray-900 border-gray-800 focus:outline-none focus:ring-gray-800 focus:border-gray-800 sm:text-sm rounded-md"
              />
            </div>
          </div>
        </div>

        <div class="form">
          <span class="float-left text-green-400 text-sm">Use Pin</span>
          <div class="float-right">
            <Toggle v-model="form.pin.enabled" />
          </div>
          <div class="clear-both"></div>
          <p class="help text-sm text-gray-400">
            If enabled, your api key will be stored when you log out and re-used if you enter the
            right pin when logging in.
          </p>
        </div>

        <div v-if="form.pin.enabled" class="form">
          <label v-if="config.pin.secret" class="text-sm block text-center font-bold text-red-500"
            >CHANGE PIN</label
          >
          <label v-else class="text-sm block text-center font-bold text-green-500">PIN</label>
          <Pin v-model="form.pin.secret" />
        </div>
      </div>
      <div class="mt-8 text-center">
        <p v-if="saved" class="text-green-300 mb-2">#Changes Saved Successfully</p>
        <LoadingButton :click="saveSettings" class="bg-green-700 w-44">Save Settings</LoadingButton>
      </div>
    </template>
    <template v-else>
      <h6 class="text-gray-400 mt-10 mb-3 text-center">Pin is required to modify settings.</h6>
      <EnterPin :on-success="() => (pinAuth = true)"></EnterPin>
    </template>
  </div>
</template>

<script>
import Toggle from "../components/Toggle.vue";
import { mapState } from "vuex";
import { chromeStore } from "../../package/WebStore";
import Pin from "../views/Pin.vue";
import EnterPin from "../components/EnterPin.vue";

export default {
  name: "Settings",
  components: { EnterPin, Pin, Toggle },
  data() {
    return {
      pinAuth: false,
      form: {
        clips: { watch: false, interval: 2 },
        pin: { enabled: false, secret: null },
        perPage: { local: 50 }
      },
      intervals: [2, 5, 10, 20, 30, 60],
      saved: false,
      timeout: 0
    };
  },

  computed: {
    ...mapState(["config"])
  },

  mounted() {
    if (this.config) {
      this.form.clips = Object.assign({}, this.config.clips);
      this.form.pin = Object.assign({}, this.config.pin);
      this.form.perPage = Object.assign({}, this.config.perPage);
    }
  },

  methods: {
    saveSettings(btn) {
      const config = Object.assign({}, this.config);

      config.clips = this.form.clips;
      config.pin = this.form.pin;

      if (config.pin.enabled) {
        if (config.pin.secret && config.pin.secret.length !== 4) {
          return btn.stopLoading();
        }
      } else {
        config.pin.secret = null;
      }

      let localLimit = Number(this.form.perPage.local) || 10;
      if (localLimit < 10) {
        localLimit = 10;
      } else if (localLimit > 250) {
        localLimit = 250;
      }

      config.perPage.local = localLimit;
      this.form.perPage.local = localLimit;

      chromeStore.set({ config }, () => {
        this.pinAuth = true;
        this.$store.commit("setConfig", config);
        this.saved = true;
        clearTimeout(this.timeout);
        setTimeout(() => (this.saved = false), 2000);
        btn.stopLoading();
      });
    }
  }
};
</script>
