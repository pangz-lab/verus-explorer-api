import axios from 'axios';
import { Payload, ServicePayload } from './Payload';

export class MiningPoolStats {
    private static urlTime = 'https://miningpoolstats.stream/data/time';
    private static urlMiningData = 'https://data.miningpoolstats.stream/data/veruscoin.js';
    private static urlCoinPriceData = 'https://data.miningpoolstats.stream/data/price/veruscoin.js';
    private static urlCoinMarketData = 'https://data.miningpoolstats.stream/data/market/veruscoin.js';

    private static headers = {
        "authority": "https://data.miningpoolstats.stream",
        "cache-control": "max-age=0",
        "upgrade-insecure-requests": "1",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "sec-fetch-site": "none",
        "sec-fetch-mode": "navigate",
        "sec-fetch-user": "?1",
        "sec-fetch-dest": "document",
        "accept-language": "en-US,en;q=0.9",
    };

    static async getMiningData(): Promise<ServicePayload> {
        return await MiningPoolStats.request(MiningPoolStats.urlMiningData, 'getMiningData');
    }

    static async getCoinSupplyData(): Promise<ServicePayload> {
        return await MiningPoolStats.request(MiningPoolStats.urlCoinPriceData, 'getCoinSupplyData');
    }

    static async getCoinMarketData(): Promise<ServicePayload> {
        return await MiningPoolStats.request(MiningPoolStats.urlCoinMarketData, 'getCoinMarketData');
    }

    private static async getTime(): Promise<any> {
        return axios.get(MiningPoolStats.urlTime);
    }

    private static async request(url: string, methodName: string): Promise<ServicePayload> {
        try {
            const timeResponse = await MiningPoolStats.getTime();
            const time = timeResponse.data;
            const response: any = await axios.get(url + `?t=${time}`, { headers: MiningPoolStats.headers });

            if (response.status != 200 || response.data === undefined) {
                Payload.logError(
                    'fetch mining data',
                    `-`,
                    methodName);
                    return Payload.withError();
            }
            const d = response.data;
            if (d.data === undefined) { return Payload.withError(); }
            return Payload.withSuccess(d.data);
        } catch (e) {
            Payload.logError(
                'fetch mining data - [Exception] : ' + e,
                `-`,
                methodName);
            return Payload.withError();
        }
    }
}
