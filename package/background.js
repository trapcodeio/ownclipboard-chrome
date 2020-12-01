// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
import config from "./config.js";
import {chromeStore} from "./WebStore.js";
import {main} from "./Main.js";
window._ = window.objectCollection.getLodash();


// noinspection JSUnresolvedVariable
chrome.runtime.onInstalled.addListener(async function () {
    const oldConfig = await chromeStore.get('config');
    const localClips = await chromeStore.get('localClips');

    if (!oldConfig) {
        await chromeStore.setSync({config})
    }

    if(!localClips){
        await chromeStore.setSync({localClips: []})
    }

    // Start Main Function.
    main().catch(console.error);
});