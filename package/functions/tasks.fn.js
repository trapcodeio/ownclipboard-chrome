/**
 * Listen for events called from the extension
 * E.g start watch!
 */
import EventsController from "../classes/EventsController.js";

export function listenForEvent(event, run) {
    // noinspection JSUnresolvedVariable
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request && request.action === event) {
            run(request.data ? request.data : {}, sendResponse);
        }
    });
}

export function listenForEvents() {
    // noinspection JSUnresolvedVariable
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const fromExtension = sender.tab === undefined;

        if (fromExtension)
            parseEventRequest(request, sendResponse)
    });
}

export function parseEventRequest(request, reply) {
    if (!request || (request && !request.action)) return;
    if (!EventsController[request.action]) return;

    EventsController[request.action](request.data, reply);
}