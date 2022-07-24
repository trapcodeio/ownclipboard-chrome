<template>
  <div v-if="loaded" class="ocb-chrome-dashboard">
    <div class="my-3 ml-3 space-x-3 text-gray-500 text-xs">
      <span>
        Total: <span class="text-green-500">({{ clips.length }})</span>
      </span>
      <span>
        Max Storage: <span class="text-green-500">({{ config.perPage.local }})</span>
      </span>
      <span>
        Watching: <span class="text-green-500">{{ config.clips.watch }}</span>
      </span>
    </div>
    <Clips style="max-height: 430px" :local="true" :clips="clips" />
  </div>
</template>

<script>
import { computed, ref } from "vue";
import store from "../store/index";
import { loadLocalClips } from "../../package/functions/utils.fn";
import Clips from "../components/Clips.vue";

export default {
  name: "Local",
  components: { Clips },
  setup() {
    const loaded = ref(false);
    const $clips = ref([]);
    const config = computed(() => store.state.config);

    loadLocalClips()
      .then((clips) => {
        if (Array.isArray(clips)) $clips.value = clips;
        loaded.value = true;
      })
      .catch((e) => e);

    return { clips: $clips, loaded, config };
  }
};
</script>
