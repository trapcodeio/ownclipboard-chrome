<template>
  <button @click.prevent="onClick" :disabled="isLoading" :class="computedButtonClass">
    <span v-if="isLoading" class="blink">
      <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {{ message || 'Loading' }}...
    </span>
    <slot v-else/>
  </button>
</template>

<script>

export default {
  model: {
    prop: 'loading',
    event: 'on-switch'
  },
  props: {
    message: {
      type: String,
      default: 'Loading'
    },
    on: {
      type: String,
      default: ''
    },
    off: {
      type: String,
      default: ''
    },
    click: {
      type: Function,
      default: () => () => {
      },
    },
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: [Array, Object, String, Number, Boolean],
      default: null
    },
    noButtonClass: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: false,
      buttonIsDisabled: false,
    }
  },
  computed: {
    computedButtonClass() {
      let $class = this.noButtonClass ? "" : "loading-button ";
      let on = this.on;
      let off = this.off;
      if (off.length && !on.length) {
        on = off;
      }
      if (this.isLoading) {
        $class += on;
      } else {
        $class += this.off;
      }
      return $class;
    }
  },
  mounted() {
    if (this.loading) {
      this.startLoading();
    }
  },
  methods: {
    startLoading() {
      this.isLoading = true;
      this.buttonIsDisabled = true;
    },
    stopLoading(run = undefined) {
      this.isLoading = false;
      this.buttonIsDisabled = false;
      if (run && typeof run === "function") run();
    },
    onClick() {
      if (!this.isLoading) {
        this.startLoading();
        return this.click(this, this.data);
      }
    }
  }
}
</script>

<style scoped>
.loading-button {
  @apply py-2 px-4 rounded-sm text-white;
  @apply focus:outline-none;
}
</style>