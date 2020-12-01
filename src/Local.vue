<template>
  <div v-if="loaded" class="ocb-chrome-dashboard">
    <Clips :local="true" :clips="clips"/>
  </div>
</template>

<script>
import {ref} from "vue";
import {loadLocalClips} from "../package/functions/utils.fn";
import Clips from "@/components/Clips";

function setup() {
  const loaded = ref(false)
  const $clips = ref([])


  loadLocalClips().then(clips => {

    if (Array.isArray(clips))
      $clips.value = clips;

    loaded.value = true;

  }).catch(e => e)

  return {clips: $clips, loaded}
}


export default {
  name: 'Local',
  components: {Clips},
  setup
}
</script>

<style scoped>

</style>