import { chromeStore } from "../WebStore";
import ObjectCollection from "object-collection";

/**
 * Creates a getter
 * @param getterFn
 * @returns {{initial, readonly value: *}|*}
 */
export function getter(getterFn: (...args: any[]) => any) {
  const value = getterFn();
  return {
    value,
    get current() {
      return getterFn();
    },
    hasChanged() {
      return this.value !== this.current;
    },
    updateValue() {
      this.value = this.current;
    }
  };
}

/**
 * Get Chrome Config
 * @returns {Promise<unknown>}
 */
export function getConfig() {
  return chromeStore.get("config");
}

export function updateConfig(data: Record<string, any>, config?: any) {
  return new Promise(async (resolve) => {
    if (!config) {
      config = await getConfig();
    }

    const $config = ObjectCollection.use(config);

    if (data) $config.set(data);

    chromeStore.set({ config: $config.data }, () => resolve($config.data));
  });
}

/**
 * Read Clipboard
 * @returns {string|null}
 */
export function readClipboard() {
  // return navigator.clipboard.readText();
  const textArea = document.getElementById("ocb-chrome-textarea") as HTMLInputElement;
  if (textArea) {
    textArea.value = "";
    textArea.select();

    if (document.execCommand("paste")) {
      return textArea.value;
    }
  }

  return null;
}

// export function nl2br(str: string, is_xhtml = false) {
//   if (typeof str === "undefined" || str === null) {
//     return "";
//   }
//   const breakTag = is_xhtml || typeof is_xhtml === "undefined" ? "<br />" : "<br>";
//   return (str + "").replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1" + breakTag + "$2");
// }
