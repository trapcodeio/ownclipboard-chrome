import { computed, reactive } from "vue";

export const search = reactive({
  show: true,
  query: ""
});

export const hasSearchQuery = computed(() => {
  return search.query.length;
});
