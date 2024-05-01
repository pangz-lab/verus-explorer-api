import axios from 'axios';
import { AppConfig } from '../../../AppConfig';

export class ChainExternalApi {
    private static readonly url = AppConfig.get().nodeApi.host;
    private static createPayload(): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            "Authorization": AppConfig.get().nodeApi.authToken
        }
    }

    static async send(method: string, params: Object): Promise<Object> {
        const payload = {"jsonrpc": "1.0", "id":"curltest", "method": method, "params": params}
        return await axios.post(
            this.url,
            payload,
            this.createPayload());
    }
}