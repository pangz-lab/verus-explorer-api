import { Request, Response } from 'express';
import { RpcRequestBody } from 'verusd-rpc-ts-client/lib/types/RpcRequest';
import { PayloadCache } from '../services/caching/Caching';
import { CacheKeys } from '../services/caching/CacheKeys';
import { ServicePayload } from '../services/payload/Payload';
import { Transaction as TransactionService } from "../services/chain/Transaction";

export class Transaction {
    static async info(req: Request, res: Response) {
        const body = req.body as RpcRequestBody;
        const blockHeightOrHash = body.params![0] as string;
        const cacheKey = CacheKeys.TxInfoPrefix.key + blockHeightOrHash;
        const ttl = CacheKeys.TxInfoPrefix.ttl;
        // var resBody: ServicePayload;

        // resBody = await Caching.get<ServicePayload>(cacheKey);
        // if(resBody == undefined) {
        //     resBody = await TransactionService.getInfo(blockHeightOrHash);
        //     if(resBody != undefined && resBody.error) {
        //         return res
        //             .status(500)
        //             .send("Internal server error!");
        //     }
        //     Caching.set(cacheKey, resBody, ttl);
        // }

        // res.send(resBody);

        const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
            source: async () => await TransactionService.getInfo(blockHeightOrHash),
            onErrorCheck: (r) => r == undefined || (r != undefined && r.error),
            key: cacheKey,
            ttl: ttl
        });

        if(resBody === undefined) { return res.status(500).send("Internal server error!"); }
        res.send(resBody);
    }
}