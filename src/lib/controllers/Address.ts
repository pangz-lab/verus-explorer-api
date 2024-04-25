import { Request, Response } from 'express';
import { CacheKeys } from '../services/caching/CacheKeys';
import { PayloadCache } from '../services/caching/Caching';
import { ServicePayload } from '../services/payload/Payload';
import { Address as AddressService } from '../services/chain/Address';

export class Address {
    static async txIds(req: Request, res: Response) {
        const address = req.params.address as string;
        const cacheKey = CacheKeys.AddressTxListPrefix.key + address;
        const ttl = CacheKeys.AddressTxListPrefix.ttl;

        const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
            source: async () => await AddressService.getTxIds(address),
            onErrorCheck: (r) => r == undefined || (r != undefined && r.error),
            key: cacheKey,
            ttl: ttl
        });

        if(resBody === undefined) {
            return res.status(500).send("Internal server error!");
        }

        res.send(resBody);
    }

    static async balance(req: Request, res: Response) {
        const address = req.params.address as string;

        const cacheKey = CacheKeys.AddressBalancePrefix.key + address;
        const ttl = CacheKeys.AddressBalancePrefix.ttl;

        const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
            source: async () => await AddressService.getBalance(address),
            onErrorCheck: (r) => r == undefined || (r != undefined && r.error),
            key: cacheKey,
            ttl: ttl
        });

        if(resBody === undefined) {
            return res.status(500).send("Internal server error!");
        }

        res.send(resBody);
    }
}