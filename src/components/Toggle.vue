<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <!-- On: "bg-indigo-600", Off: "bg-gray-200" -->
  <button @click.prevent="onClick" type="button" aria-pressed="false"
          :class="`ocb-chrome-toggle ${modelValue ? 'on' : 'off'}`">
    <span class="sr-only">Use setting</span>
    <!-- On: "translate-x-5", Off: "translate-x-0" -->
    <span aria-hidden="true"
          class="toggle"></span>
  </button>
</template>

<script>
export default {
  // model: {
  //   prop: 'enabled',
  //   event: 'updateToggle'
  // },
  name: 'Toggle',
  data() {
    return {
      on: false,
    };
  },
  // emits: ['updateToggle'],
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    if (this.modelValue) this.on = true;
  },
  methods: {
    onClick() {
      this.on = !this.modelValue;
      this.$emit('update:modelValue', this.on);
    },
  },
};
</script>