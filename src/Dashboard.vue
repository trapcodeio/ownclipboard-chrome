<template>
  <div class="ocb-chrome-dashboard">

    <div class="" v-if="loaded">
      <div class="mb-5 mx-3 mt-3">
        <h3 class="text-lg float-left">{{ config.appName }}</h3>
        <div class="float-right">
          <span class="text-xs text-gray-400"> Last Refreshed: <TimeAgo class="text-xs text-green-500"
                                                                        :date="clips.date"/></span>
        </div>
        <div class="clear-both"></div>
      </div>
      <template v-for="(clip, clipId) in clips.data" :key="clipId">
        <div class="clip">
          <div @click.prevent="previewClip(clip)" class="truncate">
            {{ clip.content.substring(0, 150) }}{{ clip.content.length > 150 ? '...' : '' }}
          </div>
          <div class="meta">
            <div class="float-left">
              <TimeAgo class="text-gray-400 text-xs" :date="clip.created_at"></TimeAgo>
            </div>
            <div class="float-right">
              <a href="#"><span class="text-green-400">view</span></a>
            </div>
            <div class="clear-both"></div>
          </div>
        </div>
      </template>
    </div>
    <Busy v-else message="Fetching clips" class="text-gray-500"/>
  </div>
</template>

<script>
import {ref, computed} from "vue";
import Busy from "@/components/Busy";
import store from "./store/index";
import {OwnClipboardApi} from "../package/OwnClipboardApi";
import TimeAgo from "@/components/TimeAgo";
import {chromeStore} from "../package/WebStore";

async function loadClipsFromCacheOrServer() {
  const clipsCache = await chromeStore.get('clips');
  if (clipsCache) {
    console.warn(clipsCache.date)
    return clipsCache;
  } else {
    const {clips} = await OwnClipboardApi.getClips()
    if (clips) {
      clips.date = '2015';
      chromeStore.set({clips});
    }

    return clips;
  }
}

function setup() {
  const loaded = ref(false);
  const $clips = ref({
    data: [],
    total: 0
  })
  const config = computed(() => store.state.config);


  /**
   * @type {*} clips
   */
  loadClipsFromCacheOrServer().then(clips => {

    if (clips) $clips.value = clips;
    loaded.value = true;

  }).catch(e => e);


  return {loaded, config, clips: $clips}
}

export default {
  name: 'Clips',
  components: {TimeAgo, Busy},
  setup,
  methods: {
    previewClip(clip) {
      console.log(clip)
    }
  }
}
</script>

<style lang="scss" scoped>
.clip {
  @apply cursor-pointer text-gray-400 text-sm bg-gray-900 p-2 rounded mx-3 mt-3;
  transition: .5s all;

  &:hover {
    color: #faebd7;

    .meta {
      @apply block
    }
  }

  .meta {
    @apply hidden;
  }
}
</style>