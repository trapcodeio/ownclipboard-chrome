import BrowserStorage from "./browser-storage/BrowserStorage.js";

export const localStore = BrowserStorage.getLocalStore();

export const chromeStore = {
    get(key, $default) {
        return new Promise((resolve) => {
            // noinspection JSUnresolvedVariable
            if (chrome && chrome.storage) {
                // noinspection JSUnresolvedVariable
                chrome.storage.local.get(key, function (data) {
                    resolve(data[key] === undefined ? $default : data[key]);
                });
            } else {
                resolve(localStore.getObject(key));
            }
        });
    },

    set(data, run) {
        run = run || (() => {});

        // noinspection JSUnresolvedVariable
        if (chrome && chrome.storage) {
            // noinspection JSUnresolvedVariable
            chrome.storage.local.set(data, run);
        } else {
            const firstKey = Object.keys(data)[0];
            if (firstKey) {
                localStore.setObject(firstKey, data[firstKey]);
                run();
            }
        }
    },

    setAsync(data) {
        return new Promise((resolve) => {
            return this.set(data, resolve);
        });
    },

    remove(key) {
        // noinspection JSUnresolvedVariable
        if (chrome && chrome.storage) {
            // noinspection JSUnresolvedVariable
            chrome.storage.local.remove(key);
        } else {
            localStore.remove(key);
        }
    }
};
