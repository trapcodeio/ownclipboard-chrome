export const isDev = import.meta.env.DEV;

export function tellBackground(action, data = {}, handleResponse = undefined) {
  // noinspection JSUnresolvedVariable
  if (!isDev) {
    // noinspection JSUnresolvedVariable
    handleResponse
      ? chrome.runtime.sendMessage({ action, data }, handleResponse)
      : chrome.runtime.sendMessage({ action, data });
  }
}
