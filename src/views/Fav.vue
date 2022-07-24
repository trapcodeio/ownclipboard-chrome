<template>
  <div v-if="loaded" class="ocb-chrome-dashboard">
    <div class="my-3 ml-3 text-gray-500 text-xs">
      Total: <span class="text-green-500">({{ clips.length }})</span>
    </div>
    <Clips :is-fav-list="true" style="max-height: 430px" :local="true" :clips="clips" />
  </div>
</template>

<script>
import { ref } from "vue";
import { loadFavClips } from "../../package/functions/utils.fn";
import Clips from "../components/Clips.vue";

export default {
  name: "Local",
  components: { Clips },
  setup() {
    const loaded = ref(false);
    const $clips = ref([]);

    loadFavClips()
      .then((clips) => {
        if (Array.isArray(clips)) $clips.value = clips;

        loaded.value = true;
      })
      .catch((e) => e);

    return { clips: $clips, loaded };
  }
};
</script>

<style scoped></style>
