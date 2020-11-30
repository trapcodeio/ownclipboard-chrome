<template>
  <div class="ocb-chrome-dashboard">
    <div class="" v-if="loaded && config">
      <div class="mb-5 mx-3 mt-3">
        <h3 class="text-lg text-center">
          {{ config.appName }}
          <a @click.prevent="logout" class="float-right cursor-pointer text-red-400 hover:text-red-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </a>
        </h3>
        <div class="text-xs text-gray-400 mt-2">
          <span class="float-left">Device: <strong class="text-green-500">{{ config.user.connectedData.name }}</strong></span>

          <span class="float-right"> Last Refreshed: <TimeAgo class="text-xs text-green-500"
                                                              :date="clips.date"/></span>
          <div class="clear-both"></div>
        </div>

        <div class="text-center my-3">
          <template v-if="isRefreshing">
            <a @click.prevent="isRefreshing=false" class="text-green-500 hover:text-gray-600 cursor-pointer">
              <svg class="w-6 h-6 mx-auto animate-spin" fill="none"
                   stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span class="text-sm">Refreshing...</span>
            </a>
          </template>
          <a @click.prevent="refreshClips" v-else>
            <svg
                class="w-6 h-6 mx-auto text-gray-600 hover:text-green-500 cursor-pointer" fill="none"
                stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="clips">
        <template v-for="(clip, clipId) in clips.data" :key="clipId">
          <div class="clip">
            <h6 v-if="copied===clip.code" class="text-xs text-center capitalize text-green-300">#copied
              successfully!</h6>
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
    </div>
    <Busy v-else message="Fetching clips" class="text-gray-500"/>
  </div>
</template>

<script>
import {ref, computed} from "vue";
import Busy from "@/components/Busy";
import store from "./store/index";
import TimeAgo from "@/components/TimeAgo";
import {copyTextToClipboard, loadClipsFromCacheOrServer, loadClipsFromServer} from "../package/functions/utils.fn";
import LoadingButton from "@/components/LoadingButton";
import {chromeStore} from "../package/WebStore";
import config from "../package/config";

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
  components: {LoadingButton, TimeAgo, Busy},
  setup,
  data() {
    return {
      copied: false,
      copiedTimeOut: 0,
      isRefreshing: false
    }
  },
  methods: {
    refreshClips() {
      this.isRefreshing = true;
      loadClipsFromServer().then(clips => {
        if (clips) this.clips = clips;
      }).catch(e => e).finally(() => {
        this.isRefreshing = false
      });
    },
    previewClip(clip) {
      copyTextToClipboard(clip.content);
      this.copied = clip.code;

      clearTimeout(this.copiedTimeOut);

      this.copiedTimeOut = setTimeout(() => {
        this.copied = false
      }, 1000);
    },

    logout() {
      chromeStore.remove('clips');
      chromeStore.set({config});
      store.commit('setConfig', config);
    }
  }
}
</script>

<style lang="scss" scoped>
.ocb-chrome-dashboard {
  .clips {
    @apply overflow-y-auto;
    max-height: 360px;

    .clip {
      @apply cursor-pointer text-gray-400 text-sm bg-gray-900 p-2 rounded mx-3 mt-3;
      transition: .3s all;

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

    .refresh-btn {
      color: unset;
      @apply text-sm text-red-50;
    }
  }

}

</style>