// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import config from "./config.js";
import { chromeStore } from "./WebStore";
import { checkDaemon, main, startWatch, stopWatching } from "./Main.js";
import { listenForEvents } from "./functions/tasks.fn.js";

// On Installed function
async function onInstalled() {
  const oldConfig = await chromeStore.get("config");
  const localClips = await chromeStore.get("localClips");
  const favClips = await chromeStore.get("favClips");

  if (!oldConfig) {
    await chromeStore.setAsync({ config });
  }

  if (!localClips) {
    await chromeStore.setAsync({ localClips: [] });
  }

  if (!favClips) {
    await chromeStore.setAsync({ favClips: [] });
  }
}

// noinspection JSUnresolvedsVariable
chrome.runtime.onInstalled.addListener(function () {
  onInstalled().then(main).catch(console.error);
});

// Check if daemon is running.
checkDaemon().catch(console.error);

// Listen for other events
listenForEvents({
  startWatch,
  stopWatching,
  checkDaemon
});
