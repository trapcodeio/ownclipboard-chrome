<script setup lang="ts">
import { defineProps, defineEmits, reactive, watch, toRefs, onMounted, computed, ref } from "vue";
import { es } from "timeago.js/lib/lang";

// Define props
const props = defineProps({
  hasQuery: {
    type: Boolean,
    default: false
  },
  hasSearchResults: {
    type: Boolean,
    default: undefined
  },
  delay: {
    type: Number,
    default: 0
  },
  placeholder: { type: String, default: "Search Clips" }
});

// Convert props to reactive properties
const { hasSearchResults, delay } = toRefs(props);

// Define emits
const emit = defineEmits(["search", "update:hasQuery"]);

const searchQuery = ref("");

let delayTimer: NodeJS.Timer;
watch(searchQuery, (query) => {
  // if delay use setTimeout to delay search
  // else search immediately
  if (delay.value) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(() => {
      runSearch(query);
    }, delay.value);
  } else {
    runSearch(query);
  }
});

function runSearch(query: string) {
  emit("search", query);
  emit("update:hasQuery", query.length > 0);
}
</script>

<template>
  <form class="mx-3 searchBar">
    <input :placeholder="placeholder" type="search" v-model="searchQuery" />
  </form>

  <template v-if="searchQuery.length">
    <h6 v-if="hasSearchResults === true" class="text-center my-1 text-xs text-green-400">
      Showing Search results for <b class="text-orange-100">{{ searchQuery }}</b>
    </h6>
    <h6 v-else-if="hasSearchResults === false" class="text-center my-1 text-xs text-red-400">
      No Search results for <b class="text-orange-100">{{ searchQuery }}</b>
    </h6>
  </template>
</template>
