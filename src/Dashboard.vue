<template>
  <div>
    <template v-if="loaded">

    </template>
    <Busy v-else message="Fetching clips" class="text-gray-500"/>
  </div>
</template>``

<script>
import {ref} from "vue";
import Busy from "@/components/Busy";

function setup({config}) {
  const loaded = ref(false);

  return {loaded}
}

export default {
  name: 'Clips',
  components: {Busy},
  props: ['config'],
  setup,
}
</script>