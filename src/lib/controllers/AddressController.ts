import { Request, Response } from 'express';
import { CacheKeys } from '../services/caching/CacheKeys';
import { PayloadCache } from '../services/caching/Caching';
import { ServicePayload } from '../services/Payload';
import { AddressService } from '../services/chain/AddressService';
import { AddressType, AddressValidator, IdentityValidator } from '../services/Validator';
import { Logger } from '../services/Logger';

export class AddressController {
    static async txIds(req: Request, res: Response) {
        try {
            const address = req.params.address as string;
            if(!AddressController.isValidAddress(address)) { return res.status(400).send("Invalid request!"); }

            const cacheKey = CacheKeys.AddressTxListPrefix.key + address;
            const ttl = CacheKeys.AddressTxListPrefix.ttl;

            const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
                source: async () => await AddressService.getTxIds(address),
                onAbortSave: (r) => r === undefined || (r != undefined && r.error),
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

    static async balance(req: Request, res: Response) {
        try {
            const address = req.params.address as string;

            if(!AddressController.isValidAddress(address)) { return res.status(400).send("Invalid request!"); }

            const cacheKey = CacheKeys.AddressBalancePrefix.key + address;
            const ttl = CacheKeys.AddressBalancePrefix.ttl;

            const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
                source: async () => await AddressService.getBalance(address),
                onAbortSave: (r) => r === undefined || (r != undefined && r.error),
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

    private static isValidAddress(address: string) {
        return AddressValidator.getType(address) != AddressType.unknown 
        || IdentityValidator.isValidVerusId(address.replace('@', ''))
    }
}