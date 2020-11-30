import {chromeStore} from "../WebStore.js";


/**
 * Creates a getter
 * @param getter
 * @returns {{initial, readonly value: *}|*}
 */
export function getter(getter) {
    const value = getter();
    return {
        value,
        get current() {
            return getter()
        },
        hasChanged(){
            return this.value !== this.current;
        },
        updateValue(){
            this.value = this.current;
        }
    }
}


/**
 * Get Chrome Config
 * @returns {Promise<unknown>}
 */
export function getConfig(){
    return chromeStore.get('config');
}

/**
 * Read Clipboard
 * @returns {string|null}
 */
export function readClipboard() {
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