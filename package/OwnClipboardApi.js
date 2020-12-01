import http from "./http.js";
import {chromeStore} from "./WebStore.js";

export class OwnClipboardApi {
    static async getClips(page){
        const config = await chromeStore.get('config');
        let api_key;

        if(config){
            api_key = config.user.key;
        }

        return http.get('/all', {params: { page, api_key}});
    }
}