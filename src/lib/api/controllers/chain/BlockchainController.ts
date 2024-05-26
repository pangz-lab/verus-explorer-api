import { Request, Response } from 'express';
import { CacheKeys } from '../../../services/caching/CacheKeys';
import { PayloadCache } from '../../../services/caching/Caching';
import { Payload, ServicePayload } from '../../../services/Payload';
import { BlockchainService } from "../../../services/chain/BlockchainService";
import { Logger } from '../../../services/Logger';

export class BlockchainController {
    static async info(req: Request, res: Response) {
        try {
            const resBody = await BlockchainService.getInfo();
            res.send(resBody);
        } catch(e) {
            Logger.toErrorLog('[HTTP Error]'+ (e as string)).write();
            return res.status(500).send("Internal server error!");
        }
    };

    static async miningInfo(req: Request, res: Response) {
        try {
            const resBody = await BlockchainService.getMiningInfo();
            res.send(resBody);
        } catch(e) {
            Logger.toErrorLog('[HTTP Error]'+ (e as string)).write();
            return res.status(500).send("Internal server error!");
        }
    }
    
    static async height(req: Request, res: Response) {
        try {
            const cacheKey = CacheKeys.BlockchainHeight.key;
            const ttl = CacheKeys.BlockchainHeight.ttl;

            const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
                source: async () => await BlockchainService.getHeight(),
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

    static async status(req: Request, res: Response) {
        try {
            const cacheKey = CacheKeys.BlockchainStatus.key;
            const ttl = CacheKeys.BlockchainStatus.ttl;

            const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
                source: async () => {
                    const data = await BlockchainService.getCurrentState()
                    return (data === undefined)?
                        Payload.withError():
                        Payload.withSuccess(data);
                },
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