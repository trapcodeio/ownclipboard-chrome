<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import store from "../store";
import { clearLocalClips, loadLocalClips } from "../../package/functions/utils.fn";
import Clips from "../components/Clips.vue";
import type { Clip } from "../../package/types";
import Search from "../components/Search.vue";
import SearchVisibilityButton from "../components/SearchVisibilityButton.vue";
import { useRouteHelpers } from "../frontend";
import type { ILoadingButton } from "revue-components/vues/component-types";

const { onPageName } = useRouteHelpers();
const loaded = ref(false);
const clips = ref<Clip[]>([]);
const config = computed(() => store.state.config);
const searchData = ref<Clip[]>([]);

const showSearch = ref(false);
const hasSearchQuery = ref(false);

function getClips() {
  loadLocalClips()
    .then(($clips) => {
      if (Array.isArray($clips)) clips.value = $clips;
      loaded.value = true;
    })
    .catch((e) => e);
}

onMounted(getClips);
onPageName("local", getClips);

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

function clearAll(btn: ILoadingButton) {
  const shouldClear = confirm("Are you sure you want to clear all local histories?");

  if (!shouldClear) return btn.stopLoading();

  clearLocalClips()
    .then(() => {
      clips.value = [];
    })
    .finally(btn.stopLoading);
}
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
        <SearchVisibilityButton v-model="showSearch" />
      </div>
    </div>

    <Search
      v-if="showSearch"
      @search="runSearch"
      v-model:hasQuery="hasSearchQuery"
      :has-search-results="searchData.length > 0"
    />

    <Clips
      :style="{
        'max-height': showSearch ? (hasSearchQuery ? '324px' : '340px') : '385px'
      }"
      :local="true"
      :clips="displayedClips"
    />

    <div v-if="clips.length > 1" class="text-right my-2 mx-3">
      <LoadingButton
        :click="clearAll"
        message="Clearing.."
        no-button-class
        class="text-xs text-red-400 bg-gray-900 hover:text-white hover:bg-red-500 rounded px-2 py-1"
      >
        Clear All
      </LoadingButton>
    </div>
  </div>
</template>
