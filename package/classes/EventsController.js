import {chromeStore} from "../WebStore.js";
import {html_formatted} from "../functions/lean.fn.js";

export default {

    /**
     * Delete a local clip
     */
    async deleteLocalClip({clip}) {
        const localClips = await chromeStore.get('localClips', []);

        // Remove clip if exists.
        _.remove(localClips, c => c.content === clip.content);
        // Update LocalClips
        chromeStore.set({localClips});
    },

    async favClip({clip}, reply) {
        let favClips = await chromeStore.get('favClips', []);
        // Check if clip exists in local
        const existingContentIndex = _.find(favClips, d => d.content === clip.content);

        // if clip has content
        if (existingContentIndex < 0) {
            // sort content!
            favClips.unshift({
                content: clip.content,
                html_formatted: html_formatted(clip.content),
                last_copied: new Date().toISOString(),
                created_at: new Date().toISOString(),
            })

            // Save new data to local store.
            await chromeStore.setSync({favClips});
            reply(true);
        } else {
            reply(false);
        }
    }
}