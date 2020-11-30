// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
import config from "./config.js";
import {chromeStore} from "./WebStore.js";
import {getConfig, getter, readClipboard} from "./functions/chrome.fn.js";

const clipboard = getter(readClipboard);
let keepWatching = false;

// noinspection JSUnresolvedVariable
chrome.runtime.onInstalled.addListener(function () {
    // Set Config
    chromeStore.set({config}, () => {
        // Start Main Function
        main().catch(console.error);
    })
});

/**
 * Main Function
 * @returns {Promise<void>}
 */
async function main() {
    /**
     * @type {import('./config.js')|unknown}
     */
    const config = await getConfig();

    // noinspection JSUnresolvedVariable
    if (config && config.clips.watch) {
        keepWatching = true;
        watchClipboard(config.clips.interval);
    }
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
    const config = await getConfig();

    if (!config || (config && !config.user.connected)) {
        keepWatching = false;
        console.log('Stopped watching! No user connected!');
        return;
    }

    clipboard.updateValue();
    const clip = clipboard.value;

    // Validate new clip
    if (!clip || typeof clip !== "string" || (clip && !clip.trim().length)) return;
}