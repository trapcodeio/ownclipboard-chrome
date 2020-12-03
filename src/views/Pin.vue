<template>
  <div title="Toggle Visibility" class="space-x-4 text-center mt-2">
    <a href="#" ref="eye" @click.prevent="showPassword=!showPassword"
       class="inline-block text-gray-500 hover:text-green-500 focus:outline-none">
      <svg v-if="showPassword" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
           xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
      </svg>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
           xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
      </svg>
    </a>
    <input :disabled="disabled" ref="pin_a" v-model="pins.a" maxlength="1" :type="showPassword? 'text':'password'"
           class="pin-box">
    <input :disabled="disabled" ref="pin_b" v-model="pins.b" maxlength="1" :type="showPassword? 'text':'password'"
           class="pin-box">
    <input :disabled="disabled" ref="pin_c" v-model="pins.c" maxlength="1" :type="showPassword? 'text':'password'"
           class="pin-box">
    <input :disabled="disabled" ref="pin_d" v-model="pins.d" maxlength="1" :type="showPassword? 'text':'password'"
           class="pin-box">
    <a title="Clear" href="#" ref="clear"
       @click.prevent="pins={a: null, b: null, c: null, d: null}"
       class="inline-block text-gray-500 hover:text-green-500 focus:outline-none">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"></path>
      </svg>
    </a>
  </div>
</template>
<script>
export default {
  name: 'Pin',
  props: ['disabled', 'clear', 'focus'],
  data() {
    return {
      showPassword: false,
      pins: {a: null, b: null, c: null, d: null},
    };
  },
  watch: {
    clear(newValue, oldValue) {
      if (newValue === true && oldValue === false) {
        this.pins = {a: null, b: null, c: null, d: null};
        this.$refs.pin_a.focus();
      }
    },

    'pins.a'() {
      if (this.pins.a && this.pins.a.length === 1) {
        this.$refs?.pin_b.focus();
      }
      this.updateModelValue();
    },
    'pins.b'() {
      if (this.pins.b && this.pins.b.length === 1) {
        this.$refs?.pin_c.focus();
      }
      this.updateModelValue();
    },
    'pins.c'() {
      if (this.pins.c && this.pins.c.length === 1) {
        this.$refs?.pin_d.focus();
      }
      this.updateModelValue();
    },
    'pins.d'() {
      if (this.pins.d && this.pins.d.length === 1) {
        this.$refs?.eye.focus();
      }
      this.updateModelValue();
    },
  },

  computed: {
    computedPins() {
      return Object.values(this.pins).join('');
    },
  },

  mounted() {
    if (this.focus && this.$refs.pin_a) {
      this.$refs.pin_a.focus();
    }
  },

  methods: {
    updateModelValue() {
      this.$emit('update:modelValue', this.computedPins);
    },
  },
};
</script>
<style scoped lang="scss">
.pin-box {
  @apply w-10 rounded border-gray-700 bg-gray-900 inline-block focus:outline-none focus:ring-green-500 focus:border-green-500;

  &:disabled {
    @apply bg-green-900 text-white;
  }
}
</style>