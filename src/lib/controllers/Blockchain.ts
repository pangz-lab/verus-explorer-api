import { Request, Response } from 'express';
import { CacheKeys } from '../services/caching/CacheKeys';
import { Caching } from '../services/caching/Caching';
import { ServicePayload } from '../services/payload/Payload';
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
        var resBody: ServicePayload;

        resBody = await Caching.get<ServicePayload>(cacheKey);
        if(resBody == undefined) {
            resBody = await BlockchainService.getHeight();
            if(resBody != undefined && resBody.error) {
                return res
                    .status(500)
                    .send("Internal server error!");
            }
            Caching.set(cacheKey, resBody, ttl);
        }

        res.send(resBody);
    }

    static async status(req: Request, res: Response) {
        const cacheKey = CacheKeys.BlockchainStatus.key;
        const ttl = CacheKeys.BlockchainStatus.ttl;
        var resBody: ServicePayload;

        resBody = await Caching.get<ServicePayload>(cacheKey);
        if(resBody == undefined) {
            resBody = await BlockchainService.getStatus();
            if(resBody != undefined && resBody.error) {
                return res
                    .status(500)
                    .send("Internal server error!");
            }
            Caching.set(cacheKey, resBody, ttl);
        }

        res.send(resBody);
    }
}