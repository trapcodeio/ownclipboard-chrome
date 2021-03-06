import {chromeStore} from "../WebStore.js";
import {OwnClipboardApi} from "../OwnClipboardApi.js";

export async function loadClipsFromCacheOrServer() {
    const clipsCache = await chromeStore.get('clips');
    if (clipsCache) {
        return clipsCache;
    } else {
        return await loadClipsFromServer();
    }
}


export function loadLocalClips() {
    return chromeStore.get('localClips');
}

export function loadFavClips() {
    return chromeStore.get('favClips');
}

export async function loadClipsFromServer(page) {
    const {clips} = await OwnClipboardApi.getClips(page)

    if (clips) {
        clips.date = new Date().toISOString();
        chromeStore.set({clips});
    }

    return clips;
}

export function copyTextToClipboard(text) {
    //Create a textbox field where we can insert text to.
    const copyFrom = document.createElement("textarea");

    //Set the text content to be the text you wished to copy.
    copyFrom.textContent = text;

    //Append the textbox field into the body as a child.
    //"execCommand()" only works when there exists selected text, and the text is inside
    //document.body (meaning the text is part of a valid rendered HTML element).
    document.body.appendChild(copyFrom);

    //Select all the text!
    copyFrom.select();

    //Execute command
    document.execCommand('copy');

    //(Optional) De-select the text using blur().
    copyFrom.blur();

    //Remove the textbox field from the document.body, so no other JavaScript nor
    //other elements can get access to this.
    document.body.removeChild(copyFrom);
}