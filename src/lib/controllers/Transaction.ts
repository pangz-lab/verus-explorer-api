import { Request, Response } from 'express';
import { PayloadCache } from '../services/caching/Caching';
import { CacheKeys } from '../services/caching/CacheKeys';
import { ServicePayload } from '../services/payload/Payload';
import { Transaction as TransactionService } from "../services/chain/Transaction";

export class Transaction {
    static async info(req: Request, res: Response) {
        const txHash = req.params.txHash as string;

        const cacheKey = CacheKeys.TxInfoPrefix.key + txHash;
        const ttl = CacheKeys.TxInfoPrefix.ttl;

        const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
            source: async () => await TransactionService.getInfo(txHash),
            onReturnUndefinedIf: (r) => r == undefined || (r != undefined && r.error),
            key: cacheKey,
            ttl: ttl
        });

        if(resBody === undefined) { return res.status(500).send("Internal server error!"); }
        res.send(resBody);
    }
}