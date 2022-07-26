import http from "./http";
import { chromeStore } from "./WebStore";
import type { PaginatedClip } from "./types";

export type GetClipsQuery = { page?: number; search?: string };

export class OwnClipboardApi {
  static async getClips(query: GetClipsQuery) {
    const config = await chromeStore.get("config");
    let api_key;

    if (config) api_key = config.user.key;

    return http.get<any, { clips: PaginatedClip; search?: string }>("/all", {
      params: query,
      headers: { "oc-key": api_key }
    });
  }
}
