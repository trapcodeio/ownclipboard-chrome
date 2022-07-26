<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import store from "../store";
import { loadClipsFromCacheOrServer, loadClipsFromServer } from "../../package/functions/utils.fn";
import Clips from "../components/Clips.vue";
import Pagination from "../components/Pagination.vue";
import Search from "../components/Search.vue";
import { useRoute } from "vue-router";
import type { Clip, PaginatedClip } from "../../package/types";
import SearchVisibilityButton from "../components/SearchVisibilityButton.vue";
import { Paginated } from "xpress-mongo/src/types/pagination";

const $route = useRoute();

// get page from route query
const page = computed(() => Number($route.query.page as string) || 1);


const loaded = ref(false);
const isRefreshing = ref(false);
const clips = ref(Paginated<Clip>() as PaginatedClip);
// const searchData = ref<PaginatedClip>(Paginated<Clip>() as PaginatedClip);

const config = computed(() => store.state.config);
const showSearch = ref(false);
const hasSearchQuery = ref(false);
const hasSearchResults = ref<boolean>();

function updateHasSearchResults(search?: string) {
  if (typeof search === "undefined") {
    hasSearchResults.value = undefined;
  } else {
    hasSearchResults.value = !!search;
  }
}


// watch page
watch(page, (newPage) => {
  loaded.value = false;
  loadClipsFromServer({ page: newPage }).then(({ clips: $clips, search }) => {
    if ($clips) clips.value = $clips;
    updateHasSearchResults(search);
    loaded.value = true;
  });
});


function refreshClips() {
  showSearch.value = false;
  isRefreshing.value = true;
  loadClipsFromServer()
    .then(({ clips: $clips }) => {
      if ($clips) clips.value = $clips;
    })
    .catch((e) => e)
    .finally(() => {
      isRefreshing.value = false;
    });
}

let timer: NodeJS.Timer;

function runSearch(search: string) {
  let timeout = 300;

  if (!search.length) {
    loaded.value = true;
    timeout = 0;
  }

  clearTimeout(timer);
  isRefreshing.value = true;

  timer = setTimeout(() => {
    loadClipsFromServer({ search })
      .then(({ clips: $clips, search }) => {
        if ($clips) clips.value = $clips;

        if (clips.value.data.length === 0) {
          hasSearchResults.value = false;
        } else {
          updateHasSearchResults(search);
        }

        loaded.value = true;
      }).finally(() => {
      isRefreshing.value = false;
    });
  }, timeout);
}


onMounted(() => {
  // Load clips from cache or server
  loadClipsFromCacheOrServer()
    .then(($clips) => {
      if ($clips) clips.value = $clips;
      loaded.value = true;
    })
    .catch((e) => e);
});


// const displayedClips = computed(() => {
//   return hasSearchResults.value ? searchData.value : clips.value;
// });

</script>

<template>
  <div class="ocb-chrome-dashboard">
    <div v-if="loaded && config">
      <div class="mb-5 mx-3 mt-3">
        <div class="text-xs text-gray-400 mt-2">
          <span class="float-left">
            Device:
            <strong class="text-green-500 mr-2">{{ config.user.connectedData?.name }}</strong> Total:
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
          <div v-if="showSearch" class="w-full">
            <Search
              @search="runSearch"
              v-model:hasQuery="hasSearchQuery"
              :has-search-results="hasSearchResults"
            />
          </div>
          <div class="py-1 flex-initial">
            <SearchVisibilityButton v-model="showSearch" />
          </div>
        </div>
      </div>
      <Clips :clips="clips" />
      <Pagination v-model="page" class="mt-3" :data="clips" />
    </div>
    <Busy v-else message="Fetching clips" class="text-gray-500" />
  </div>
</template>


<style lang="scss">
.ocb-chrome-dashboard {
}
</style>
