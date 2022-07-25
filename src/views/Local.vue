<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import store from "../store";
import { loadLocalClips } from "../../package/functions/utils.fn";
import Clips from "../components/Clips.vue";
import type { Clip } from "../../package/types";

const loaded = ref(false);
const clips = ref<Clip[]>([]);
const config = computed(() => store.state.config);
const searchData = ref<Clip[]>([]);
const search = reactive({
  show: false,
  query: ""
});

onMounted(() => {
  loadLocalClips()
    .then(($clips) => {
      if (Array.isArray($clips)) clips.value = $clips;
      loaded.value = true;
    })
    .catch((e) => e);
});

function runSearch() {
  if (!search.query.length) {
    searchData.value = [];
    return;
  }

  searchData.value = clips.value.filter((clip) => {
    return clip.content.toLowerCase().includes(search.query.toLowerCase());
  });
}

watch(() => search.query, runSearch);

const hasSearchQuery = computed(() => {
  return search.query.length;
});

const displayedClips = computed(() => {
  return hasSearchQuery.value ? searchData.value : clips.value;
});
</script>

<template>
  <div v-if="loaded && config" class="ocb-chrome-dashboard">
    <div class="flex justify-between">
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

      <div class="mx-3 py-2">
        <!--  Search Button-->
        <button
          @click.prevent="search.show = !search.show"
          class="text-gray-500 hover:text-green-500"
        >
          <template v-if="search.show">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </template>
          <template v-else>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </template>
        </button>
      </div>
    </div>

    <form v-if="search.show" class="mx-3 searchBar">
      <input placeholder="Search Clips" type="search" v-model="search.query" />

      <!--      <LoadingButton :click="runSearch" no-button-class no-triple-dots message="">-->
      <!--        <svg-->
      <!--          xmlns="http://www.w3.org/2000/svg"-->
      <!--          class="h-6 w-6"-->
      <!--          fill="none"-->
      <!--          viewBox="0 0 24 24"-->
      <!--          stroke="currentColor"-->
      <!--          stroke-width="2"-->
      <!--        >-->
      <!--          <path-->
      <!--            stroke-linecap="round"-->
      <!--            stroke-linejoin="round"-->
      <!--            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"-->
      <!--          />-->
      <!--        </svg>-->
      <!--      </LoadingButton>-->
    </form>

    <template v-if="hasSearchQuery">
      <h6 v-if="searchData.length" class="text-center my-1 text-xs text-green-400">
        Showing Search results for <b class="text-orange-100">{{ search.query }}</b>
      </h6>
      <h6 v-else class="text-center my-1 text-xs text-red-400">
        No Search results for <b class="text-orange-100">{{ search.query }}</b>
      </h6>
    </template>

    <Clips
      :style="{
        'max-height': search.show ? (search.query.length ? '359px' : '375px') : '420px'
      }"
      :local="true"
      :clips="displayedClips"
    />
  </div>
</template>

<style lang="scss">
.searchBar {
  @apply px-1 flex bg-gray-900 rounded  bg-gray-900;
  @apply border hover:border-green-500 hover:border-opacity-60 border-gray-700;

  input {
    color: antiquewhite;
    @apply text-sm w-full bg-transparent border-none p-2 focus:outline-none focus:ring-0;
  }

  button {
    @apply text-sm focus:outline-none focus:ring-0 text-sm  text-gray-500 hover:text-green-500;
  }
}
</style>
