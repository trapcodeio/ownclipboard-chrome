<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import store from "../store";
import { loadLocalClips } from "../../package/functions/utils.fn";
import Clips from "../components/Clips.vue";
import type { Clip } from "../../package/types";
import Search from "../components/Search.vue";
import { search, hasSearchQuery } from "../components/search.state";
import SearchVisibilityButton from "../components/SearchVisibilityButton.vue";

const loaded = ref(false);
const clips = ref<Clip[]>([]);
const config = computed(() => store.state.config);
const searchData = ref<Clip[]>([]);


onMounted(() => {
  loadLocalClips()
    .then(($clips) => {
      if (Array.isArray($clips)) clips.value = $clips;
      loaded.value = true;
    })
    .catch((e) => e);
});

function runSearch(query: string) {
  if (!query.length) {
    searchData.value = [];
    return;
  }

  searchData.value = clips.value.filter((clip) => {
    return clip.content.toLowerCase().includes(query.toLowerCase());
  });
}

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
        <SearchVisibilityButton />
      </div>
    </div>

    <Search @search="runSearch" :has-search-results="searchData.length>0" />
    <!--    <form v-if="search.show" class="mx-3 searchBar">-->
    <!--      <input placeholder="Search Clips" type="search" v-model="search.query" />-->
    <!--    </form>-->

    <!--    <template v-if="hasSearchQuery">-->
    <!--      <h6 v-if="searchData.length" class="text-center my-1 text-xs text-green-400">-->
    <!--        Showing Search results for <b class="text-orange-100">{{ search.query }}</b>-->
    <!--      </h6>-->
    <!--      <h6 v-else class="text-center my-1 text-xs text-red-400">-->
    <!--        No Search results for <b class="text-orange-100">{{ search.query }}</b>-->
    <!--      </h6>-->
    <!--    </template>-->

    <Clips
      :style="{
        'max-height': search.show ? (hasSearchQuery ? '359px' : '375px') : '420px'
      }"
      :local="true"
      :clips="displayedClips"
    />
  </div>
</template>
