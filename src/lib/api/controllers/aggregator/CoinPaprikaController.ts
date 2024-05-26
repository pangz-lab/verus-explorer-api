import { Request, Response } from 'express';
import { PayloadCache } from '../../../services/caching/Caching';
import { CacheKeys } from '../../../services/caching/CacheKeys';
import { ServicePayload } from '../../../services/Payload';
import { Logger } from '../../../services/Logger';
import { CoinPaprikaService } from '../../../services/aggregator/CoinPaprikaService';

export class CoinPaprikaController {
    static async getCoinMarketData(req: Request, res: Response) {
        try {
            const aggregator = 'coinpaprika';
            const cacheKey = CacheKeys.AggregatorDataPrefix.key + aggregator;
            const ttl = CacheKeys.AggregatorDataPrefix.ttl;

            const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
                source: async () => await CoinPaprikaService.getCoinMarket(),
                abortSaveOn: (r) => r === undefined || (r != undefined && r.error),
                key: cacheKey,
                ttl: ttl
            });
            
            if(resBody === undefined) { return res.status(404).send("Failed to retrieve the data!"); }
            res.send(resBody);
        } catch(e) {
            Logger.toErrorLog('[HTTP Error]'+ (e as string)).write();
            return res.status(500).send("Internal server error!");
        }
    }
}