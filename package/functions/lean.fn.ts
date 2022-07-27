import { loadClipsFromServer } from "./utils.fn";

export function nl2br(str: string, is_xhtml = false) {
  if (typeof str === "undefined" || str === null) {
    return "";
  }
  const breakTag = is_xhtml || typeof is_xhtml === "undefined" ? "<br />" : "<br>";
  return (str + "").replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1" + breakTag + "$2");
}

export const htmlEntities = (rawStr: string) =>
  rawStr.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
    return "&#" + i.charCodeAt(0) + ";";
  });

export function html_formatted(content: string) {
  return nl2br(htmlEntities(content));
}

export function copyObjectUsingJson<T extends object>(data: T) {
  return JSON.parse(JSON.stringify(data)) as T;
}
