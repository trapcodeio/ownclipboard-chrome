import axios from "axios";
import { chromeStore } from "./WebStore";
import { isDev } from "./config";

const http = new axios.create({
  baseURL: "https://ownclipboard.com/api"
});

chromeStore.get("config").then((config) => {
  if (config && config.customApiHost) {
    const host = new URL(config.customApiHost);
    host.pathname = "/api";
    http.defaults.baseURL = host.href;

    if (isDev) console.log(`Using custom API host: ${host.href}`);
  }
});

http.interceptors.response.use((res) => {
  return res.data.data;
});

export { axios };
export default http;
