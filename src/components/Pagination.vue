<template>
  <section v-if="data.total>data.perPage">
    <nav class="pagination" role="navigation" aria-label="pagination">
      <div class="space-x-2 float-right">
        <a title="Previous Page" :disabled="data.page===1" @click.prevent="openPage(data.page-1)" class="pagination-previous">
          <svg class="w-6 h-6 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
          </svg>
        </a>
        <a title="Next Page" :disabled="data.page===data.lastPage" @click.prevent="openPage(data.page+1)" class="pagination-next">
          <svg class="w-6 h-6 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </a>
      </div>
      <div class="pagination-list float-left space-x-2">
        <template v-if="data.page>3">
          <a @click.prevent="openPage(1)" class="pagination-link">1</a>
          <span class="pagination-ellipsis">&hellip;</span>
          <a @click.prevent="openPage(data.page-1)" class="pagination-link">{{ data.page - 1 }}</a>
          <template v-if="data.page!==data.lastPage"><a @click.prevent="openPage(data.page)"
                                                        class="pagination-link is-current"
                                                        aria-current="page">{{ data.page }}</a>
          </template>
          <template v-if="data.page+1<data.lastPage"><a @click.prevent="openPage(data.page+1)"
                                                        class="pagination-link">{{ data.page + 1 }}</a>
          </template>
        </template>
        <template v-else>
          <template v-for="(pageIndex, pID) in pagesArray" :key="pID">
            <a @click.prevent="openPage(pageIndex)"
               :class="'pagination-link' + (data.page===pageIndex ?' is-current':'')"
               aria-label="Goto page 1">{{ pageIndex }}</a>
          </template>
        </template>
        <template v-if="data.lastPage>=5||data.page===4">
          <span class="pagination-ellipsis">&hellip;</span>
          <a @click.prevent="openPage(data.lastPage)"
             :class="('pagination-link ' + (data.lastPage===data.page ? 'is-current':'')).trim()">{{
              data.lastPage
            }}</a>
        </template>
      </div>
      <div class="clear-both"></div>
    </nav>
  </section>
</template>

<script>
export default {
  model: {
    prop: 'page',
    event: 'update-page',
  },
  props: {
    page: {type: Number, default: 1},
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    name: {
      type: String,
      default: 'page',
    },
  },
  data() {
    return {};
  },
  computed: {
    pagesArray() {
      const lists = [];
      let lastPage = Number(this.data.lastPage);
      if (lastPage >= 5) {
        lastPage = 4;
      }

      let i = 0;
      while (i < lastPage) {
        lists[i] = i + 1;
        i++;
      }
      return lists;
    },
  },
  methods: {
    openPage(page) {
      if (page >= 1) {
        const query = {...this.$route.query, page};
        this.$router.push({name: this.$route.name, query});
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  @apply block w-full mt-2 px-3;

  .pagination-previous, .pagination-next {
    @apply px-3 py-1  text-sm bg-green-800 hover:bg-green-900 rounded text-green-200 cursor-pointer;
  }

  .pagination-list {
    @apply block list-none;
  }


  .pagination-link {
    @apply px-2 py-1  text-sm bg-gray-900 hover:bg-green-900 rounded text-green-300 cursor-pointer;
    @apply inline-block;
  }

  .pagination-link.is-current {
    @apply bg-green-800 text-green-200;
  }
}

.pagination-link, .pagination-next, .pagination-previous {
  color: whitesmoke;
}
</style>
