// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
import config from './config.js'
import {chromeStore} from "./WebStore.js";

const clipboard = {
    get read(){
        return Clipboard.read()
    }
}

class Clipboard {
    static read() {
        const textArea = document.getElementById('ocb-chrome-textarea');
        if (textArea) {
            textArea.value = '';
            textArea.select();

            if (document.execCommand('paste')) {
                return textArea.value;
            }
        }

        return null;
    }
}

// noinspection JSUnresolvedVariable
chrome.runtime.onInstalled.addListener(function () {
    // Set Config
    chromeStore.set({config})

    // Log
    console.log(clipboard.read);
});