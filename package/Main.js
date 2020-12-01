import {getConfig, getter, readClipboard, updateConfig} from "./functions/chrome.fn.js";
import {listenForEvent, listenForEvents} from "./functions/tasks.fn.js";
import {chromeStore} from "./WebStore.js";
import {html_formatted} from "./functions/lean.fn.js";

const _ = window.objectCollection.getLodash();

const clipboard = getter(readClipboard);
let keepWatching = false;

/**
 * Main Function
 * @returns {Promise<void>}
 */
export async function main() {
    /**
     * @type {import('./config.js')|unknown}
     */
    const config = await getConfig();

    // If Watch is enabled in config then watch clipboard
    // noinspection JSUnresolvedVariable
    if (config && config.clips.watch) {
        keepWatching = true;
        watchClipboard(config.clips.interval);
    }

    // Also listen for startWatch event.
    // This modifies app settings, enables `clips.watch`
    listenForEvent('startWatch', async () => {
        // Update Config
        await updateConfig({
            'clips.watch': true,
        })

        keepWatching = true;
        watchClipboard(config.clips.interval);

        console.log('Now watching!');
    });

    // listen for other events
    listenForEvents()
}

function watchClipboard(interval) {
    if (keepWatching) {
        setTimeout(() => {
            /**
             * Check if clipboard has changed
             */
            if (clipboard.hasChanged()) {
                clipBoardHasChanged()
                    .then(() => watchClipboard(interval))
                    .catch(console.error);
            } else {
                watchClipboard(interval);
            }
        }, interval * 1000)
    }
}

async function clipBoardHasChanged() {
    clipboard.updateValue();
    let clip = clipboard.value;

    // Validate new clip
    if (!clip || typeof clip !== "string" || (clip && !clip.trim().length)) return;

    // Trim CLip
    clip = clip.trim();

    // Get All Local Clips
    const localClips = await chromeStore.get('localClips');
    let data = localClips ? localClips : [];

    if(data.length >= 50){
        data.pop();
    }

    // Check if clip exists in local
    const existingContentIndex = _.findIndex(data, d => d.content === clip);

    // if clip has content
    if (existingContentIndex >= 0) {
        // sort content!
        data[existingContentIndex].last_copied = new Date().toISOString();
        data = _.sortBy(data, ['last_copied'])
        data.reverse();
    } else {
        data.unshift({
            content: clip,
            html_formatted: html_formatted(clip),
            last_copied: new Date().toISOString(),
            created_at: new Date().toISOString(),
        })
    }

    // Save new data to local store.
    await chromeStore.setSync({localClips: data});
}