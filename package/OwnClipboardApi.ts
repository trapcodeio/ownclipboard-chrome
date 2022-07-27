import http from "./http";
import { chromeStore } from "./WebStore";
import type { PaginatedClip } from "./types";

export type GetClipsQuery = { page?: number | string; search?: string };

export class OwnClipboardApi {
  static async getClips(query: GetClipsQuery) {
    const config = await chromeStore.get("config");
    let api_key;

    if (config) api_key = config.user.key;
    if (typeof query.page === "string") query.page = parseInt(query.page as string);

    return http.get<any, { clips: PaginatedClip; search?: string }>("/all", {
      params: query,
      headers: { "oc-key": api_key }
    });
  }
}
