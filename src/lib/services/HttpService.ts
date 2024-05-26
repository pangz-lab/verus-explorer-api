import axios from 'axios';
import { AppConfig } from '../../AppConfig';
import { Logger } from './Logger';

export class HttpService {
    private static readonly url = AppConfig.get().nodeApi.host;
    private static readonly maxRetry = 5;

    private static createPayload(): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            "Authorization": AppConfig.get().nodeApi.authToken
        }
    }

    static async sendChainRpcRequest(method: string, params: Object): Promise<Object> {
        const payload = {"jsonrpc": "1.0", "id":"curltest", "method": method, "params": params}
        var status = 0;
        var retry = 0;
        var result: any;
        do {
            result = await axios.post(
                this.url,
                payload,
                this.createPayload()
            );
            retry += 1;
            status = result.status;
            Logger.toDebugLog(
                '⛓️‍💥 ' 
                + (status != 200 ? '❗️ ' : '✅ ')
                + "Chain RPC Request :" 
                + method 
                + ' / params: ' 
                + JSON.stringify(params) 
                + ' / result : ' 
                + status
            ).write();
        } while(status != 200 && retry < HttpService.maxRetry);
        return result;
    }
    
    static async sendGetRequest(url: string, headers: Object): Promise<Object> {
        var status = 0;
        var retry = 0;
        var result: any;
        do {
            result = await axios.get(url, headers);
            retry += 1;
            status = result.status;
            Logger.toDebugLog(
                '📦 ' 
                + (status != 200 ? '❗️ ' : '✅ ')
                + "HTTP GET Request :" 
                + url
                + ' / result : ' 
                + status
            ).write();
        } while(status != 200 && retry < HttpService.maxRetry);
        return result;
    }
}