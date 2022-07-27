import { useRoute } from "vue-router";
import { watch } from "vue";

export const isDev = import.meta.env.DEV;
export const TEST_HOST = import.meta.env.VITE_TEST_HOST as string;
export const TEST_API_KEY = import.meta.env.VITE_TEST_API_KEY as string;

export function tellBackground(
  action: string,
  data: Record<string, any> = {},
  handleResponse = undefined
) {
  // noinspection JSUnresolvedVariable
  if (!isDev) {
    // noinspection JSUnresolvedVariable
    handleResponse
      ? chrome.runtime.sendMessage({ action, data }, handleResponse)
      : chrome.runtime.sendMessage({ action, data });
  }
}

/**
 * Route Helpers
 */
export function useRouteHelpers() {
  const $route = useRoute();

  function onPageNameChange(fn: (name?: string) => void | any) {
    watch(() => $route.name as string | undefined, fn);
  }

  function onPageName(name: string, fn: (name?: string) => void | any) {
    onPageNameChange(($name) => {
      if ($name === name) fn();
    });
  }

  return { onPageNameChange, onPageName };
}
