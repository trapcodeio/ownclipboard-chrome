import { getConfig, getter, readClipboard, updateConfig } from "./functions/chrome.fn";
import { chromeStore } from "./WebStore";
import { html_formatted } from "./functions/lean.fn";
import _ from "lodash";
import type { Clip } from "./types";

// const _ = window.objectCollection.getLodash();

const clipboard = getter(readClipboard);
let keepWatching = false;
let timeout: NodeJS.Timeout;

/**
 * Main Function
 * @returns {Promise<void>}
 */
export async function main() {
  /**
   * @type {import("./config.ts")|unknown}
   */
  const config = await getConfig();

  // If Watch is enabled in config then watch clipboard
  // noinspection JSUnresolvedVariable
  if (config && config.clips.watch) {
    keepWatching = true;
    watchClipboard(config.clips.interval);
  }
}

export async function checkDaemon() {
  const config = await getConfig();

  // If Watch is enabled in config then watch clipboard
  // noinspection JSUnresolvedVariable
  if (config && config.clips.watch) {
    keepWatching = true;
    watchClipboard(config.clips.interval);
  }
}

export async function startWatch() {
  const config = await getConfig();

  // Update Config
  await updateConfig({
    "clips.watch": true
  });

  keepWatching = true;
  watchClipboard(config.clips.interval);

  // console.log('Now watching!');
}

export async function stopWatching() {
  clearTimeout(timeout);
  keepWatching = false;

  await updateConfig({
    "clips.watch": false
  });

  // console.log('Stopped watching.');
}

export function watchClipboard(interval: number) {
  if (keepWatching) {
    if (timeout !== null) clearTimeout(timeout);

    timeout = setTimeout(() => {
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
    }, interval * 1000);
  }
}

export async function clipBoardHasChanged() {
  clipboard.updateValue();
  let clip = clipboard.value;

  // Validate new clip
  if (!clip || typeof clip !== "string" || (clip && !clip.trim().length)) return;

  // Trim CLip
  clip = clip.trim();

  // Get All Local Clips
  const localClips = await chromeStore.get("localClips");
  let data: Clip[] = localClips ? localClips : [];

  // Check if clip exists in local
  const existingContentIndex = _.findIndex(data, (d) => d.content === clip);

  // if clip has content
  if (existingContentIndex >= 0) {
    // sort content!
    data[existingContentIndex].last_copied = new Date().toISOString();
    data = _.sortBy(data, ["last_copied"]);
    data.reverse();
  } else {
    const config = await getConfig();

    if (data.length >= config.perPage.local) {
      data.pop();
    }

    data.unshift({
      content: clip,
      html_formatted: html_formatted(clip),
      last_copied: new Date().toISOString(),
      created_at: new Date().toISOString()
    });
  }

  // Save new data to local store.
  await chromeStore.setAsync({ localClips: data });
}
