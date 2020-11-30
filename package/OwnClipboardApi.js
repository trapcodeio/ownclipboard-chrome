import http from "./http";
import {chromeStore} from "./WebStore";

export class OwnClipboardApi {
    static async getClips(){
        const config = await chromeStore.get('config');
        let api_key;

        if(config){
            api_key = config.user.key;
        }

        return http.get('/all', {params: {api_key}});
    }
}