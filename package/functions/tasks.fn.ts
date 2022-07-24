/**
 * Listen for events called from the extension
 * E.g. start watch!
 */
import EventsController from "../classes/EventsController";

export function listenForEvent(event: string, run: (...args: any[]) => void) {
  // noinspection JSUnresolvedVariable
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request && request.action === event) {
      run(request.data ? request.data : {}, sendResponse);
      return true;
    }
  });
}

export function listenForEvents(events: Record<string, any>) {
  const hasEvents = events && typeof events === "object" && Object.keys(events).length;
  // noinspection JSUnresolvedVariable
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!request || (request && !request.action)) return;

    if (hasEvents) {
      if (Object.keys(events).includes(request.action)) {
        events[request.action](request.data, sendResponse);
        return;
      }
    }

    if (!EventsController.hasOwnProperty(request.action)) return;
    (EventsController as Record<string, any>)[request.action](request.data, sendResponse);
  });
}
