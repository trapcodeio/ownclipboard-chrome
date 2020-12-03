// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
import config from './config.js';
import {chromeStore} from './WebStore.js';
import {checkDaemon, main, startWatch, stopWatching} from './Main.js';
import {listenForEvents} from './functions/tasks.fn.js';

window._ = window.objectCollection.getLodash();

// On Installed function
async function onInstalled() {
	const oldConfig = await chromeStore.get('config');
	const localClips = await chromeStore.get('localClips');
	const favClips = await chromeStore.get('favClips');
	
	if (!oldConfig) {
		await chromeStore.setSync({config});
	}
	
	if (!localClips) {
		await chromeStore.setSync({localClips: []});
	}
	
	if (!favClips) {
		await chromeStore.setSync({favClips: []});
	}
}

// noinspection JSUnresolvedVariable
chrome.runtime.onInstalled.addListener(function() {
	onInstalled().then(main).catch(console.error);
});

// Check if daemon is running..
checkDaemon().catch(console.error);

// Listen for other events
listenForEvents({
	startWatch,
	stopWatching,
	checkDaemon,
});