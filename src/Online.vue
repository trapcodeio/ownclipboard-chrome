<template>
  <div class="ocb-chrome-dashboard">
    <div class="" v-if="loaded && config">
      <div class="mb-5 mx-3 mt-3">
        <div class="text-xs text-gray-400 mt-2">
          <span class="float-left">
            Device: <strong class="text-green-500 mr-2">{{ config.user.connectedData.name }}</strong>
            Total: <span class="text-green-500">({{clips.total}})</span>
          </span>

          <span class="float-right"> Last Refreshed: <TimeAgo class="text-xs text-green-500"
                                                              :date="clips.date"/></span>
          <div class="clear-both"></div>
        </div>

        <div class="text-center my-3 cursor-pointer">
          <template v-if="isRefreshing">
            <a @click.prevent="isRefreshing=false" class="text-green-500 hover:text-gray-600 cursor-pointer">
              <svg class="w-6 h-6 mx-auto animate-spin inline" fill="none"
                   stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span class="text-sm inline">Refreshing...</span>
            </a>
          </template>
          <a @click.prevent="refreshClips" class="text-gray-600 hover:text-green-500" v-else>
            <svg
                class="w-6 h-6 mx-auto cursor-pointer" fill="none"
                stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </a>
        </div>
      </div>
      <ClipsList :clips="clips"/>
      <Pagination v-model="page" class="mt-3" :data="clips"/>
    </div>
    <Busy v-else message="Fetching clips" class="text-gray-500"/>
  </div>
</template>

<script>
import {computed, ref} from "vue";
import store from "./store/index";
import {loadClipsFromCacheOrServer, loadClipsFromServer} from "../package/functions/utils.fn";
import ClipsList from "@/components/Clips";
import Pagination from "@/components/Pagination";

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
  name: 'Online',
  components: {Pagination, ClipsList},
  setup,

  data() {
    return {
      copied: false,
      copiedTimeOut: 0,
      isRefreshing: false
    }
  },

  computed: {
    page() {
      return this.$route.query.page;
    }
  },

  watch: {
    page(page) {
      console.log(`Page changed to ${page}`)
      this.loaded = false;
      loadClipsFromServer(page).then((clips) => {
        if (clips) this.clips = clips;
        this.loaded = true;
      })
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
  }
}
</script>

<style lang="scss">
.ocb-chrome-dashboard {

}
</style>