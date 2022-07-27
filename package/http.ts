import axios from "axios";
import { chromeStore } from "./WebStore";
import { isDev } from "../src/frontend";
import type { Config } from "./config";

const http = axios.create({
  baseURL: "https://ownclipboard.com/api"
});

chromeStore.get("config").then(setupHttp);

http.interceptors.response.use((res) => {
  return res.data.data;
});

export { axios };
export default http;

/**
 * Setup Http using config
 * @param config
 * @param api_key
 */
export function setupHttp(config: Config, api_key?: string) {
  if (config) {
    const host = new URL(config.customApiHost || config.defaultApiHost);
    host.pathname = "/api";
    http.defaults.baseURL = host.href;
    http.defaults.headers["oc-key"] = api_key || config.user.key;

    if (isDev && config.customApiHost) console.log(`Using custom API host: ${host.href}`);
  }
}
