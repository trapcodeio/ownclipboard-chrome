import {chromeStore} from "../WebStore.js";

export default {

    /**
     * Delete a local clip
     */
    async deleteLocalClip({clip}) {
        const localClips = await chromeStore.get('localClips');

        // Remove clip if exists.
        _.remove(localClips, c => c.content === clip.content);
        // Update LocalClips
        chromeStore.set({localClips});
    },


    async syncClip(content){
        const localClips = await chromeStore.get('clips');

        console.log(content)
    }
}