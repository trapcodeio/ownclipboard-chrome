<template>
  <div v-if="loaded" class="ocb-chrome-dashboard">
    <div class="my-3 ml-3 text-gray-500 text-xs">
      Total: <span class="text-green-500">({{ clips.length }})</span>
    </div>
    <Clips :is-fav-list="true" style="max-height: 430px" :local="true" :clips="clips" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { loadFavClips } from "../../package/functions/utils.fn";
import Clips from "../components/Clips.vue";
import { Clip } from "../../package/types";
import { useRouteHelpers } from "../frontend";

const { onPageName } = useRouteHelpers();
const loaded = ref(false);
const clips = ref([] as Clip[]);

function getFavClips() {
  loadFavClips()
    .then(($clips) => {
      if (Array.isArray($clips)) clips.value = $clips;
      loaded.value = true;
    })
    .catch((e) => e);
}

onMounted(getFavClips);
onPageName("fav", getFavClips);
</script>

<style scoped></style>
