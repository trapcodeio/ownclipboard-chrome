import axios from "axios";
import { chromeStore } from "./WebStore";

const http = new axios.create({
  baseURL: "https://ownclipboard.com/api"
});

chromeStore.get("customApiHost").then((customApiHost) => {
  if (customApiHost) {
    const host = new URL(customApiHost);
    host.pathname = "/api";
    http.defaults.baseURL = host.href;
  }
});

http.interceptors.response.use((res) => {
  return res.data.data;
});

export { axios };
export default http;
