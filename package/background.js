// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// noinspection JSUnresolvedVariable
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({app: 'OwnClipBoard'}, function() {
        console.log("OwnClipBoard is watching");
    });
});