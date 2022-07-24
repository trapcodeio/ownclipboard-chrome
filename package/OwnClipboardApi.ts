import http from "./http";
import { chromeStore } from "./WebStore";

export class OwnClipboardApi {
  static async getClips(page: number = 1): Promise<any> {
    const config = await chromeStore.get("config");
    let api_key;

    if (config) {
      api_key = config.user.key;
    }

    return http.get("/all", { params: { page, api_key } });
  }
}
