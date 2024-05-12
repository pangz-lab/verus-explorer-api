import { Request, Response } from 'express';
import { CacheKeys } from '../../services/caching/CacheKeys';
import { PayloadCache } from '../../services/caching/Caching';
import { ServicePayload } from '../../services/Payload';
import { BlockService } from "../../services/chain/BlockService";
import { Hashing } from '../../services/Hashing';
import { Logger } from '../../services/Logger';
import { TransactionValidator } from '../../services/Validator';
import { HttpRequestPayload } from '../../models/HttpRequestPayload';

 export class BlockController {
    static async generated(req: Request, res: Response) {
        try {
            const body = req.body as HttpRequestPayload;
            const hashList = body.params as string[];
            if(!BlockController.isHashListValid(hashList)) { return res.status(400).send("Invalid request!"); }

            const hashlistChecksum = Hashing.createChecksum(hashList.toString());
            const cacheKey = CacheKeys.BlockInfoByHashPrefix.key + hashlistChecksum;
            const ttl = CacheKeys.BlockInfoByHashPrefix.ttl;

            const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
                source: async () => await BlockService.getGeneratedFromHash(hashList),
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

    static async hashes(req: Request, res: Response) {
        try {
            
            // NOTE: Caching is conditional here
            const body = req.body as HttpRequestPayload;
            if(Number.isNaN(body.params![0]) || Number.isNaN(body.params![1])) {
                return res.status(400).send("Invalid request!");
            }

            const start = parseInt(body.params![0] as string);
            const end = parseInt(body.params![1] as string);

            const rangeLabel = start.toString() + '_' + end.toString();

            const cacheKey = CacheKeys.BlockHashesListPrefix.key + rangeLabel;
            const ttl = CacheKeys.BlockHashesListPrefix.ttl;

            const isDateRangeWithinToday = BlockController.isDateWithinRange(start, end, Math.floor(Date.now() / 1000));
            const isOneDayRange = ((start - end)/60/60) == 24;
            const useCache = isOneDayRange && !isDateRangeWithinToday;

            const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
                source: async () =>  await BlockService.getHashesByRange(start, end),
                onAbortSave: (r) => r === undefined || (r != undefined && r.error),
                key: cacheKey,
                ttl: ttl,
                useCache: useCache
            });

            if(resBody === undefined) { return res.status(404).send("Failed to retrieve the data!"); }
            res.send(resBody);
        } catch(e) {
            Logger.toErrorLog('[HTTP Error]'+ (e as string)).write();
            return res.status(500).send("Internal server error!");
        }
    }

    static async info(req: Request, res: Response) {
        try {
            const blockHeightOrHash = req.params.heightOrHash as string;
            const cacheKey = CacheKeys.BlockInfoByHashPrefix.key + blockHeightOrHash;
            const ttl = CacheKeys.BlockInfoByHashPrefix.ttl;

            const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
                source: async () => await BlockService.getInfo(blockHeightOrHash),
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

    private static isDateWithinRange(rangeStart: number, rangeEnd: number, dateToTest: number) {
        const start = (new Date(new Date(rangeStart)).toUTCString());
        const end = (new Date(new Date(rangeEnd)).toUTCString());
        const currentDate = (new Date(new Date(dateToTest)).toUTCString());
        return currentDate <= start && currentDate >= end;
    }

    private static isHashListValid(hashList: string[]): boolean {
        for (let index = 0; index < hashList.length; index++) {
            if(!TransactionValidator.isValidHash(hashList[index])) {
                return false;
            }
        }
        return true;
    }
 }