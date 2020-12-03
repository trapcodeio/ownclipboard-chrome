import {chromeStore} from "../WebStore.js";
import {html_formatted} from "../functions/lean.fn.js";

export default {

    /**
     * Delete a local clip
     */
    async deleteLocalClip({clip}) {
        const key = clip.favorite ? 'favClips' : 'localClips';
        const allClips = await chromeStore.get(key, []);

        // Remove clip if exists.
        _.remove(allClips, c => c.content === clip.content);
        // Update LocalClips
        chromeStore.set({[key]: allClips});
    },

    /**
     * Delete a local clip
     */
    async deleteOnlineClip({clip}) {
        const allClips = await chromeStore.get(key, []);

        // Remove clip if exists.
        _.remove(allClips, c => c.content === clip.content);
        // Update LocalClips
        chromeStore.set({[key]: allClips});
    },




    async favClip({clip}, reply) {
        let favClips = await chromeStore.get('favClips', []);
        // Check if clip exists in local
        const existingContentIndex = _.findIndex(favClips, d => d.content === clip.content);

        // if clip has content
        if (existingContentIndex === -1) {
            if (!clip.html_formatted)
                clip.html_formatted = html_formatted(clip.content);

            clip.last_copied = new Date().toISOString();
            clip.favorite = 1;

            // Add to beginning of array
            favClips.unshift(clip)

            // Save new data to local store.
            await chromeStore.setSync({favClips});
        }
    }
}