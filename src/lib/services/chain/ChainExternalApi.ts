import 'dotenv/config';
import axios from 'axios';

export class ChainExternalApi {
    private static readonly url = process.env.EXT_API_HOST!.toString();
    private static createPayload(): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            "Authorization": process.env.EXT_API_AUTH_TOKEN!.toString()
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