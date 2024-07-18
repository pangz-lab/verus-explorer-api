import { Request, Response } from 'express';
import { PayloadCache } from '../../../services/caching/Caching';
import { CacheKeys } from '../../../services/caching/CacheKeys';
import { ServicePayload } from '../../../services/Payload';
import { TransactionService } from "../../../services/chain/TransactionService";
import { TransactionValidator } from '../../../services/Validator';
import { Logger } from '../../../services/Logger';
import { Hashing } from '../../../services/Hashing';

export class TransactionController {
    static async info(req: Request, res: Response) {
        try {
            const txHash = req.params.txHash as string;
            if(!TransactionValidator.isValidHash(txHash)) { return res.status(400).send("Invalid request!"); }

            const cacheKey = CacheKeys.TxInfoPrefix.key + txHash;
            const ttl = CacheKeys.TxInfoPrefix.ttl;

            const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
                source: async () => await TransactionService.getInfo(txHash),
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
    
    static async decodeHexScript(req: Request, res: Response) {
        try {
            const hexScript = req.params.hexScript as string;
            if(!TransactionValidator.isValidHash(hexScript)) { return res.status(400).send("Invalid request!"); }

            const hexScriptChecksum = Hashing.createChecksum(hexScript);
            const cacheKey = CacheKeys.TxHexScriptPrefix.key + hexScriptChecksum;
            const ttl = CacheKeys.TxInfoPrefix.ttl;

            const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
                source: async () => await TransactionService.decodeHexScript(hexScript),
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