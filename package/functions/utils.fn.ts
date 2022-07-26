import { chromeStore } from "../WebStore";
import { GetClipsQuery, OwnClipboardApi } from "../OwnClipboardApi";
import { Clip, PaginatedClip } from "../types";

/**
 * Load online clips from cache or from API
 */
export async function loadClipsFromCacheOrServer() {
  const clipsCache = await chromeStore.get<PaginatedClip>("clips");
  if (clipsCache && clipsCache.total) {
    return clipsCache;
  } else {
    const { clips } = await loadClipsFromServer();
    return clips;
  }
}

/**
 * Load local clips
 */
export function loadLocalClips() {
  return chromeStore.get<Clip[]>("localClips");
}

/**
 * Load favorite clips
 */
export function loadFavClips() {
  return chromeStore.get("favClips");
}

/**
 * Load clips from server
 * @param query
 */
export async function loadClipsFromServer(query: GetClipsQuery = {}) {
  const { clips, search } = await OwnClipboardApi.getClips(query);

  if (clips) {
    clips.date = new Date().toISOString();
    if (!search) await chromeStore.setAsync({ clips });
  }

  return { clips, search };
}

/**
 * Copy Text to Clipboard
 * @param text
 */
export function copyTextToClipboard(text: string) {
  // Create a text box field where we can insert text to.
  const copyFrom = document.createElement("textarea");

  // Set the text content to be the text you wished to copy.
  copyFrom.textContent = text;

  // Append the textbox field into the body as a child.
  // "execCommand()" only works when there exists selected text, and the text is inside
  // document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);

  //Select all the text!
  copyFrom.select();

  //Execute command
  document.execCommand("copy");

  //(Optional) De-select the text using blur().
  copyFrom.blur();

  //Remove the textbox field from the document.body, so no other JavaScript nor
  //other elements can get access to this.
  document.body.removeChild(copyFrom);
}
