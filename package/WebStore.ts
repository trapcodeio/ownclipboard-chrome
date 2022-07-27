import BrowserStorage from "@trapcode/browser-storage";

export const localStore = BrowserStorage.getLocalStore();

export const chromeStore = {
  get<T = any>(key: string, $default?: T): Promise<T> {
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

  set(data: Record<string, any>, run?: () => void) {
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

  setAsync(data: Record<string, any>) {
    return new Promise<void>((resolve) => {
      return this.set(data, resolve);
    });
  },

  remove(key: string) {
    return new Promise<void>((resolve) => {
      // noinspection JSUnresolvedVariable
      if (chrome && chrome.storage) {
        // noinspection JSUnresolvedVariable
        chrome.storage.local.remove(key, resolve);
      } else {
        localStore.remove(key);
        resolve();
      }
    });
  }
};
