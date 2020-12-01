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
        hasChanged() {
            return this.value !== this.current;
        },
        updateValue() {
            this.value = this.current;
        }
    }
}


/**
 * Get Chrome Config
 * @returns {Promise<unknown>}
 */
export function getConfig() {
    return chromeStore.get('config');
}


export function updateConfig(data, config) {
    return new Promise(async (resolve) => {
        if (!config) {
            config = await getConfig();
        }

        config = window.objectCollection.use(config);

        if (data) config.set(data);

        chromeStore.set({config: config.data}, () => resolve(config.data));
    })
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

export function nl2br(str, is_xhtml = false) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    const breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}