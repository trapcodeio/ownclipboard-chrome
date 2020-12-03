<template>
  <div class="ocb-write-page px-3">

    <template v-if="saved">
      <div class="mt-16">
        <svg class="w-10 h-10 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="mb-5 text-2xl text-green-500 text-center">
          Saved!
        </h3>

        <div class="mt-10 space-x-2 text-center">
          <router-link :to="{name: 'online'}" class="button bg-gray-900 text-yellow-200 opacity-80 hover:opacity-100 p-3 rounded cursor-pointer">View
            Saved Clip</router-link>
          <a @click.prevent="resetForm" class="button bg-gray-900 text-gray-200 opacity-80 hover:opacity-100 p-3 rounded cursor-pointer">Create
            New</a>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="text-center mt-6 mb-5">
        <svg class="w-10 h-10 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
        </svg>
        <small>({{ content.length }})</small>
      </div>

      <div class="text-area-area">
      <textarea v-model="content" style="height: 300px; max-height: 300px" class="write-textarea"
                placeholder="Write to online server..."></textarea>
      </div>
      <div class="mt-2">
        <LoadingButton :click="addClip" message="Saving clip" class="bg-green-700 text-green-200 w-full text-lg">
          Save to (<span class="font-bold">{{ config.user.connectedData.name }}</span>)
        </LoadingButton>
      </div>
    </template>
  </div>
</template>

<script>
import http from "../../package/http";
import {loadClipsFromServer} from "../../package/functions/utils.fn";
import {mapState} from "vuex";

export default {
  name: 'Write',
  data() {
    return {
      content: '',
      saved: false,
    }
  },

  computed: {
    ...mapState(['config'])
  },

  methods: {
    addClip(btn) {
      http.post('add', {
        api_key: this.config?.user.key,
        content: this.content.trim()
      }).then(() => {
        loadClipsFromServer().then(() => {
          this.saved = true;
          btn.stopLoading()
        }).catch(e => e);
      }).catch(() => btn.stopLoading());
    },

    resetForm(){
      this.saved = false;
      this.content = '';
    }
  },
}
</script>