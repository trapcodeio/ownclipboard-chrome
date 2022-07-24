import { chromeStore } from "../WebStore";
import { html_formatted } from "../functions/lean.fn";
import _ from "lodash";
import type { Clip, EventsController } from "../types";

const Controller: EventsController = {
  /**
   * Delete a local clip
   */
  async deleteLocalClip({ clip }) {
    const key = clip.favorite ? "favClips" : "localClips";
    const allClips = await chromeStore.get(key, [] as Clip[]);

    // Remove clip if exists.
    _.remove(allClips, (c) => c.content === clip.content);
    // Update LocalClips
    chromeStore.set({ [key]: allClips });
  },

  async favClip({ clip }) {
    let favClips = await chromeStore.get("favClips", [] as Clip[]);
    // Check if clip exists in local
    const existingContentIndex = _.findIndex(favClips, (d) => d.content === clip.content);

    // if clip has content
    if (existingContentIndex === -1) {
      if (!clip.html_formatted) clip.html_formatted = html_formatted(clip.content);

      clip.last_copied = new Date().toISOString();
      clip.favorite = true;

      // Add to beginning of array
      favClips.unshift(clip);

      // Save new data to local store.
      await chromeStore.setAsync({ favClips });
    }
  }
};

export default Controller;
