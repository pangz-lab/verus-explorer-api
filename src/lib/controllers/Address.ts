import { Request, Response } from 'express';
import { RpcRequestBody } from 'verusd-rpc-ts-client/lib/types/RpcRequest';
import { CacheKeys } from '../services/caching/CacheKeys';
import { Caching } from '../services/caching/Caching';
import { ServicePayload } from '../services/payload/Payload';
import { Address as AddressService } from '../services/chain/Address';

export class Address {
    static async txIds(req: Request, res: Response) {
        const body = req.body as RpcRequestBody;
        const address = body.params![0]!.toString();
        const cacheKey = CacheKeys.AddressTxListPrefix.key + address;
        const ttl = CacheKeys.AddressTxListPrefix.ttl;
        var resBody: ServicePayload;

        resBody = await Caching.get<ServicePayload>(cacheKey);
        if(resBody == undefined) {
            resBody = await AddressService.getTxIds(address);
            if(resBody != undefined && resBody.error) {
                return res
                    .status(500)
                    .send("Internal server error!");
            }
            Caching.set(cacheKey, resBody, ttl);
        }
        res.send(resBody);
    }

    static async balance(req: Request, res: Response) {
        const body = req.body as RpcRequestBody;
        const address = body.params![0]!.toString();
        const cacheKey = CacheKeys.AddressBalancePrefix.key + address;
        const ttl = CacheKeys.AddressBalancePrefix.ttl;
        var resBody: ServicePayload;

        resBody = await Caching.get<ServicePayload>(cacheKey);
        if(resBody == undefined) {
            resBody = await AddressService.getBalance(address);
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