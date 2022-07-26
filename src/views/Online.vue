<template>
  <div class="ocb-chrome-dashboard">
    <div v-if="loaded && config">
      <div class="mb-5 mx-3 mt-3">
        <div class="text-xs text-gray-400 mt-2">
          <span class="float-left">
            Device:
            <strong class="text-green-500 mr-2">{{ config.user.connectedData.name }}</strong> Total:
            <span class="text-green-500">({{ clips.total }})</span>
          </span>

          <span class="float-right">
            Last Refreshed: <TimeAgo class="text-xs text-green-500" :date="clips.date"
          /></span>
          <div class="clear-both"></div>
        </div>

        <div class="flex my-3 justify-between">
          <div class="cursor-pointer py-1 flex-initial">
            <template v-if="isRefreshing">
              <a
                @click.prevent="isRefreshing = false"
                class="text-green-500 hover:text-gray-600 cursor-pointer"
              >
                <svg
                  class="w-6 h-6 mx-auto animate-spin inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
              </a>
            </template>
            <a @click.prevent="refreshClips" class="text-gray-600 hover:text-green-500" v-else>
              <svg
                class="w-6 h-6 mx-auto cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
            </a>
          </div>
          <div class="w-full">
            <Search @search="runSearch" :has-search-results="searchData.length>0" />
          </div>
          <div class="py-1 flex-initial">
            <SearchVisibilityButton/>
          </div>
        </div>
      </div>
      <Clips :clips="clips" />
      <Pagination v-model="page" class="mt-3" :data="clips" />
    </div>
    <Busy v-else message="Fetching clips" class="text-gray-500" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import store from "../store";
import { loadClipsFromCacheOrServer, loadClipsFromServer } from "../../package/functions/utils.fn";
import Clips from "../components/Clips.vue";
import Pagination from "../components/Pagination.vue";
import Search from "../components/Search.vue";
import { useRoute } from "vue-router";
import type { Clip } from "../../package/types";
import SearchVisibilityButton from "../components/SearchVisibilityButton.vue";

const $route = useRoute();
// get page from route query
const page = computed(() => $route.query.page as number);


const loaded = ref(false);
const isRefreshing = ref(false);
const clips = ref({
  data: [],
  total: 0
});
const config = computed(() => store.state.config);
const searchData = ref([] as Clip[]);


// watch page
watch(page, (newPage) => {
  loaded.value = false;
  loadClipsFromServer(newPage).then((clips) => {
    if (clips) clips.value = clips;
    loaded.value = true;
  });
});


function refreshClips() {
  isRefreshing.value = true;
  loadClipsFromServer()
    .then(($clips) => {
      if ($clips) clips.value = $clips;
    })
    .catch((e) => e)
    .finally(() => {
      isRefreshing.value = false;
    });
}

function runSearch(query: string) {
  if (!query.length) {
    searchData.value = [];
    return;
  }

  searchData.value = clips.value.data.filter((clip) => {
    return clip.content.toLowerCase().includes(query.toLowerCase());
  });
}

/**
 * @type {*} clips
 */
loadClipsFromCacheOrServer()
  .then(($clips) => {
    if ($clips) clips.value = $clips;
    loaded.value = true;
  })
  .catch((e) => e);

</script>

<style lang="scss">
.ocb-chrome-dashboard {
}
</style>
