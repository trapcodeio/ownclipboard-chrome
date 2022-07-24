<template>
  <h5 class="text-sm text-green-500 text-center font-bold">ENTER PIN</h5>
  <Pin :focus="true" :disabled="pinIsDisabled" :clear="clearPin" v-model="pin" />
  <p v-if="pinIsWrong" class="my-3 text-center text-red-400">Wrong Pin!</p>
  <div class="mt-5 text-center">
    <LoadingButton
      :click="forgotPin"
      class="bg-gray-800 text-gray-500 rounded hover:bg-gray-900 hover:text-red-400"
      >Forgot Pin?
    </LoadingButton>
  </div>
</template>
<script>
import Pin from "../views/Pin.vue";
import { chromeStore } from "../../package/WebStore";
import store from "../store";
import config from "../../package/config";
import { mapState } from "vuex";

export default {
  name: "EnterPin",
  components: { Pin },

  data() {
    return {
      pin: null,
      clearPin: false,
      pinIsWrong: false,
      pinIsDisabled: false
    };
  },

  props: {
    onSuccess: {
      required: true
    }
  },

  computed: {
    ...mapState(["config"])
  },

  watch: {
    pin() {
      if (this.pin && this.pin.length < 4) {
        this.pinIsWrong = false;
      } else if (this.pin && this.pin.length === 4) {
        this.pinIsDisabled = true;
        if (this.config.pin.secret === this.pin) {
          this.onSuccess(this.pin);
        } else {
          this.clearPin = true;
          this.pinIsWrong = true;
          this.pinIsDisabled = false;
        }
      }
    }
  },

  methods: {
    forgotPin(btn) {
      chromeStore.set({ config: config }, () => {
        store.commit("setConfig", config);
        btn.stopLoading();
      });
    }
  }
};
</script>
