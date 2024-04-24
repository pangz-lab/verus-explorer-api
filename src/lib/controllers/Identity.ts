import { Request, Response } from 'express';
import { RpcRequestBody } from 'verusd-rpc-ts-client/lib/types/RpcRequest';
import { CacheKeys } from '../services/caching/CacheKeys';
import { ServicePayload } from '../services/payload/Payload';
import { Caching } from '../services/caching/Caching';
import { Identity as IdentityService } from "../services/chain/Identity";

export class Identity {
    static async info(req: Request, res: Response) {
        const body = req.body as RpcRequestBody;
        const identityValue = body.params![0]!.toString();
        const height = body.params![1]! != undefined? parseInt(body.params![1]!.toString()) : undefined;

        const keyExt = (height != undefined ? '_' + height?.toString() : '');
        const cacheKey = CacheKeys.IdentityInfoPrefix.key + identityValue + keyExt;
        const ttl = CacheKeys.IdentityInfoPrefix.ttl;
        var resBody: ServicePayload;

        resBody = await Caching.get<ServicePayload>(cacheKey);
        if(resBody == undefined) {
            resBody = await IdentityService.getInfo(identityValue, height);
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