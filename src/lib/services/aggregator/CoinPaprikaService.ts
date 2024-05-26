import axios from 'axios';
import { AppConfig } from '../../../AppConfig';
import { ServicePayload, Payload } from '../Payload';

export class CoinPaprikaService {
    private static baseUrl = AppConfig.get().aggregator.coinPaprika.baseUrl;
    private static coin = AppConfig.get().aggregator.coinPaprika.coin;
    private static headers = {
        // 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'dnt': '1',
        'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-gpc': '1',
    }

    static async getCoinMarket(): Promise<ServicePayload> {
        const coin = CoinPaprikaService.coin;
        const url = CoinPaprikaService.baseUrl + '/coins/' + coin + '/markets';
        return await CoinPaprikaService.request(url, 'getCoinMarket');
    }

    private static async request(url: string, methodName: string): Promise<ServicePayload> {
        try {
            const response: any = await axios.get(url, { headers: CoinPaprikaService.headers });

            if (response.status != 200 || response.data[0] === undefined) {
                Payload.logError(
                    'fetch data',
                    `-`,
                    methodName);
                    return Payload.withError();
            }
            return Payload.withSuccess(response.data);
        } catch (e) {
            Payload.logError(
                'fetch data - [Exception] : ' + e,
                `-`,
                methodName);
            return Payload.withError();
        }
    }
}
