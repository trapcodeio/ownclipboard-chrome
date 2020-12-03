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
            return true;
        }
    });
}

export function listenForEvents(events) {
    const hasEvents = events && typeof events === "object" && Object.keys(events).length;
    // noinspection JSUnresolvedVariable
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (!request || (request && !request.action)) return;

        if (hasEvents) {
            if (Object.keys(events).includes(request.action)) {
                events[request.action](request.data, sendResponse);
                return
            }
        }

        if (!EventsController[request.action]) return;
        EventsController[request.action](request.data, sendResponse);
    });
}