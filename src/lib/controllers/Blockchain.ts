import { Request, Response } from 'express';
import { CacheKeys } from '../services/caching/CacheKeys';
import { PayloadCache } from '../services/caching/Caching';
import { Payload, ServicePayload } from '../services/payload/Payload';
import { Blockchain as BlockchainService } from "../services/chain/Blockchain";

export class Blockchain {
    static async info(req: Request, res: Response) {
        const resBody = await BlockchainService.getInfo();
        res.send(resBody);
    };

    static async miningInfo(req: Request, res: Response) {
        const resBody = await BlockchainService.getMiningInfo();
        res.send(resBody);
    }
    
    static async height(req: Request, res: Response) {
        const cacheKey = CacheKeys.BlockchainHeight.key;
        const ttl = CacheKeys.BlockchainHeight.ttl;

        const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
            source: async () => await BlockchainService.getHeight(),
            onErrorCheck: (r) => r == undefined || (r != undefined && r.error),
            key: cacheKey,
            ttl: ttl
        });

        if(resBody === undefined) { return res.status(500).send("Internal server error!"); }
        res.send(resBody);
    }

    static async status(req: Request, res: Response) {
        const cacheKey = CacheKeys.BlockchainStatus.key;
        const ttl = CacheKeys.BlockchainStatus.ttl;

        const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
            source: async () => {
                const data = await BlockchainService.getCurrentState()
                return (data == undefined)?
                    Payload.withError():
                    Payload.withSuccess(data);
            },
            onErrorCheck: (r) => r == undefined || (r != undefined && r.error),
            key: cacheKey,
            ttl: ttl
        });

        if(resBody === undefined) { return res.status(500).send("Internal server error!"); }
        res.send(resBody);
    }
}