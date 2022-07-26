
<script setup lang="ts">
import { defineProps, defineEmits, reactive, watch, toRefs } from "vue";
import { search, hasSearchQuery } from "./search.state";

// Define props
const props = defineProps({
  hasSearchResults: {
    type: Boolean,
    default: false
  }
});



// Convert props to reactive properties
const { hasSearchResults } = toRefs(props);
const emit = defineEmits(["search"]);

watch(
  () => search.query,
  (query) => {
    emit("search", query);
  }
);


</script>

<template>
  <form v-if="search.show" class="mx-3 searchBar">
    <input placeholder="Search Clips" type="search" v-model="search.query" />
  </form>

  <template v-if="hasSearchQuery">
    <h6 v-if="hasSearchResults" class="text-center my-1 text-xs text-green-400">
      Showing Search results for <b class="text-orange-100">{{ search.query }}</b>
    </h6>
    <h6 v-else class="text-center my-1 text-xs text-red-400">
      No Search results for <b class="text-orange-100">{{ search.query }}</b>
    </h6>
  </template>
</template>
