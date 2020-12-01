const isDev = process.env.NODE_ENV === 'development'

export function tellBackground(action, data = {}, handleResponse=undefined) {
    // noinspection JSUnresolvedVariable
    if (!isDev) {
        // noinspection JSUnresolvedVariable
        handleResponse ?
            chrome.runtime.sendMessage({action, data}, handleResponse)
            : chrome.runtime.sendMessage({action, data})
    }
}