import { Request, Response } from 'express';
import { CacheKeys } from '../../../services/caching/CacheKeys';
import { PayloadCache } from '../../../services/caching/Caching';
import { Payload, ServicePayload } from '../../../services/Payload';
import { AddressService } from '../../../services/chain/AddressService';
import { AddressType, AddressValidator, IdentityValidator } from '../../../services/Validator';
import { Logger } from '../../../services/Logger';
import { AddressDataProvider } from '../../../provider/chain/AddressDataProvider';

export class AddressController {
    static async txIdsByRange(req: Request, res: Response) {
        try {
            const address = req.params.address as string;
            // const height = (req.query.maxHeight ?? 0) as number;
            // if(!AddressController.isValidAddress(address) || height <= 0) { return res.status(400).send("Invalid request!"); }
            if(!AddressController.isValidAddress(address)) { return res.status(400).send("Invalid request!"); }

            const cacheKey = CacheKeys.AddressTxListPrefix.key + address;
            const ttl = CacheKeys.AddressTxListPrefix.ttl;

            // const resBody: string[] | undefined = await PayloadCache.get<string[]>({
            const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
                // source: async () => await AddressDataProvider.getTxIdsByNumRange(address, height),
                source: async () => await AddressService.getTxIds(address),
                    // (height === undefined)? 
                    //     await AddressService.getTxIds(address):
                    //     await AddressDataProvider.getTxIdsByNumRange(address, (height ?? 0) as number),
                // abortSaveOn: (r) => r === undefined || (r[0] === undefined),
                abortSaveOn: (r) => r === undefined,
                key: cacheKey,
                ttl: ttl
            });

            if(resBody === undefined) {
                return res.status(404).send("Failed to retrieve the data!");
            }
            // res.send(Payload.withSuccess(resBody));
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

    private static isValidAddress(address: string) {
        return AddressValidator.getType(address) != AddressType.unknown 
        || IdentityValidator.isValidVerusId(address.replace('@', ''))
    }
}