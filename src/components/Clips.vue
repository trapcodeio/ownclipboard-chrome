<template>
  <div class="clips">
    <template v-if="isViewing === false">
      <template v-for="(clip, clipId) in local ? clips : clips.data" :key="clipId">
        <div class="clip">
          <h6 v-if="copied===clipId" class="text-xs text-center capitalize text-green-300">#copied
            successfully!</h6>
          <div @click.prevent="copyClip(clip, clipId)" class="truncate">
            {{ clip.content.substring(0, 150) }}{{ clip.content.length > 150 ? '...' : '' }}
          </div>
          <div class="meta">
            <div class="float-left">
              <a title="View clip." @click.prevent="viewClip(clipId)" class="text-green-600 hover:text-green-300"><span>view</span></a>
            </div>
            <div class="float-right space-x-3">
              <template v-if="local">
                <a v-if="isSyncing===clipId"
                   class="text-gray-600">
                  <span>syncing</span>
                </a>
                <a :title="`Sync/Add to online server.`" v-else @click.prevent="syncClip(clipId)"
                   class="text-green-600 hover:text-green-300">
                  <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                       xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </a>
              </template>

              <a v-if="!clip.favorite" title="Favorite clip." @click.prevent="favClip(clipId)"
                 class="text-green-600 hover:text-green-300">
                <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </a>


              <a title="Delete clip." @click.prevent="deleteClip(clipId)"
                 class="text-red-300 hover:text-red-600">
                <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </a>


              <TimeAgo class="text-gray-400 text-xs" :date="clip.created_at"></TimeAgo>
            </div>
            <div class="clear-both"></div>
          </div>
          <h6 v-if="synced===clipId" class="text-xs text-center capitalize text-green-300">#Synced
            successfully!</h6>
          <h6 v-if="favorite===clipId" class="text-xs text-center capitalize text-green-300">#Favorited
            successfully!</h6>
        </div>
      </template>
    </template>
    <template v-else>
      <!-- View Modal -->
      <div class="fixed z-10 inset-0 overflow-y-auto">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-900 opacity-90"></div>
        </div>

        <div class="inline-block text-left top-0 w-full bg-gray-900 px-3 py-3 transform transition-all opacity-90">
          <a @click.prevent="isViewing=false" class="ml-1 text-green-500 cursor-pointer">&leftarrow; Close</a>

          <div class="mt-3 text-base">
            <div v-html="viewing" :readonly="true"></div>
          </div>
        </div>
      </div>

    </template>
  </div>
</template>

<script>
import TimeAgo from "@/components/TimeAgo"
import {copyTextToClipboard, loadClipsFromServer} from "../../package/functions/utils.fn";
import {localStore} from "../../package/WebStore";
import {ref} from "vue";
import {tellBackground} from "@/frontend";
import {mapState} from "vuex";
import http from "../../package/http";

export default {
  name: 'Clips',
  components: {TimeAgo},

  setup({clips}) {
    const clipsOnDisplay = ref(null)

    if (clips) {
      clipsOnDisplay.value = clips;
    }

    return {clipsOnDisplay}
  },

  data() {
    return {
      copied: false,
      copiedTimeOut: 0,
      isViewing: false,
      isSyncing: false,
      syncedTimeOut: 0,
      synced: false,
      favorite: false,
    }
  },

  props: {
    clips: {type: [Array, Object], default: () => ([])},
    local: {type: Boolean, default: false},
    isFavList: {type: Boolean, default: false}
  },

  computed: {
    ...mapState(['isDev', 'config']),
    computedClips() {
      return this.local ? this.clipsOnDisplay : this.clipsOnDisplay.data;
    },
    viewing() {
      if (this.isViewing === false) return null;
      const clips = this.computedClips;
      const clip = clips[this.isViewing];
      if (!clip) return null;
      return clip.html_formatted ? clip.html_formatted : clip.content;
    },
  },

  methods: {
    copyClip(clip, index) {
      copyTextToClipboard(clip.content);
      this.copied = index;

      if (this.$store.state.isDev) {
        const clips = localStore.getArray('localClips', []);
        clips.unshift({
          content: clip.content,
          last_copied: new Date().toISOString(),
          created_at: new Date().toISOString(),
        })
        localStore.setArray('localClips', clips);
      }

      clearTimeout(this.copiedTimeOut);
      this.copiedTimeOut = setTimeout(() => {
        this.copied = false
      }, 5000);
    },

    viewClip(clipId) {
      this.isViewing = clipId;
    },

    syncClip(clipId) {
      const clip = this.computedClips[clipId];
      if (!this.isSyncing && clip) {
        this.isSyncing = clipId;

        http.post('add', {
          api_key: this.config?.user.key,
          content: clip.content
        }).then(() => {
          loadClipsFromServer(this.$route.query.page).then(() => {
            this.isSyncing = false;
            this.synced = clipId;


            clearTimeout(this.syncedTimeOut);
            this.syncedTimeOut = setTimeout(() => {
              this.synced = false;
            }, 5000);

          }).catch(() => this.isSyncing = false)
        }).catch(() => this.isSyncing = false)
      }
    },

    deleteClip(clipId) {
      const shouldDelete = confirm('Are you sure you want to delete this clip?');
      if (shouldDelete) {
        const clip = this.computedClips[clipId];
        this.local
            ? this.clipsOnDisplay.splice(clipId, 1)
            : this.clipsOnDisplay.data.splice(clipId, 1);

        if (this.isDev) {
          if (this.local) {
            localStore.setArray('localClips', this.clipsOnDisplay);
          } else {
            this.deleteOnlineClip(clip);
          }
        } else {
          if (this.local) {
            tellBackground('deleteLocalClip', {clip})
          } else {
            this.deleteOnlineClip(clip);
          }
        }
      }
    },

    deleteOnlineClip(clip) {
      if (clip.code) {
        http.delete('delete', {
          params: {
            api_key: this.config?.user.key,
            clip: clip.code
          }
        }).then(() =>{
          loadClipsFromServer(this.$route.query.page)
        })
      }
    },

    favClip(clipId) {
      const clip = this.computedClips[clipId];
      tellBackground('favClip', {clip});
      this.favorite = clipId;
      clearTimeout(this.syncedTimeOut);
      this.syncedTimeOut = setTimeout(() => {
        this.favorite = false;
      }, 5000);
    },
  },
}
</script>