const isDev = process.env.NODE_ENV === 'development'
export function tellBackground(action, data={}){
    // noinspection JSUnresolvedVariable
    if(!isDev){
        // noinspection JSUnresolvedVariable
        chrome.runtime.sendMessage({action, data});
    }
}