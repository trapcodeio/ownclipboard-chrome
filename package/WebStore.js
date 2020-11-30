import BrowserStorage from "../node_modules/@trapcode/browser-storage/index.js";

export const localStore = BrowserStorage.getLocalStore();

export const chromeStore = {
    get(key, $default) {
        return new Promise((resolve) => {
            // noinspection JSUnresolvedVariable
            if (chrome && chrome.storage) {
                // noinspection JSUnresolvedVariable
                chrome.storage.sync.get(key, function (data) {
                    resolve(data[key] === undefined ? $default : data[key])
                });
            } else {
                resolve(localStore.getObject(key));
            }
        })
    },
    set(data){
        // noinspection JSUnresolvedVariable
        if(chrome && chrome.storage){
            // noinspection JSUnresolvedVariable
            chrome.storage.sync.set(data, function() {
                console.log("OwnClipBoard is installed!");
            });
        } else {
            const firstKey = Object.keys(data)[0];
            if(firstKey){
                localStore.setObject(firstKey, data[firstKey])
            }

        }
    }
};