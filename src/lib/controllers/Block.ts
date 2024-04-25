import crypto from 'crypto';
import { Request, Response } from 'express';
import { RpcRequestBody } from "verusd-rpc-ts-client/lib/types/RpcRequest";
import { CacheKeys } from '../services/caching/CacheKeys';
import { PayloadCache } from '../services/caching/Caching';
import { ServicePayload } from '../services/payload/Payload';
import { Block as BlockService } from "../services/chain/Block";

 export class Block {
    static async generated(req: Request, res: Response) {
        const body = req.body as RpcRequestBody;
        const hashList = body.params! as string[];
        const hashlistChecksum = (crypto.createHash('sha1')
            .update(hashList.toString()))
            .digest('hex');
        const cacheKey = CacheKeys.BlockInfoByHashPrefix.key + hashlistChecksum;
        const ttl = CacheKeys.BlockInfoByHashPrefix.ttl;

        const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
            source: async () => await BlockService.getGeneratedFromHash(hashList),
            onErrorCheck: (r) => r == undefined || (r != undefined && r.error),
            key: cacheKey,
            ttl: ttl
        });

        if(resBody === undefined) { return res.status(500).send("Internal server error!"); }
        res.send(resBody);
    }

    static async hashes(req: Request, res: Response) {
        // NOTE: Caching is conditional here
        const body = req.body as RpcRequestBody;
        const start = body.params![0] as number;
        const end = body.params![1] as number;
        const rangeLabel = start.toString() + '_' + end.toString();

        const cacheKey = CacheKeys.BlockHashesListPrefix.key + rangeLabel;
        const ttl = CacheKeys.BlockHashesListPrefix.ttl;

        const isDateRangeWithinToday = Block.isDateWithinRange(start, end, Math.floor(Date.now() / 1000));
        const isOneDayRange = ((start - end)/60/60) == 24;
        const useCache = isOneDayRange && !isDateRangeWithinToday;

        const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
            source: async () =>  await BlockService.getHashesByRange(start, end),
            onErrorCheck: (r) => r == undefined || (r != undefined && r.error),
            key: cacheKey,
            ttl: ttl,
            useCache: useCache
        });

        if(resBody === undefined) { return res.status(500).send("Internal server error!"); }
        res.send(resBody);
    }

    static async info(req: Request, res: Response) {
        const blockHeightOrHash = req.params.heightOrHash as string;
        const cacheKey = CacheKeys.BlockInfoByHashPrefix.key + blockHeightOrHash;
        const ttl = CacheKeys.BlockInfoByHashPrefix.ttl;

        const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
            source: async () => await BlockService.getInfo(blockHeightOrHash),
            onErrorCheck: (r) => r == undefined || (r != undefined && r.error),
            key: cacheKey,
            ttl: ttl
        });

        if(resBody === undefined) { return res.status(500).send("Internal server error!"); }
        res.send(resBody);
    }

    private static isDateWithinRange(rangeStart: number, rangeEnd: number, dateToTest: number) {
        const start = (new Date(new Date(rangeStart)).toUTCString());
        const end = (new Date(new Date(rangeEnd)).toUTCString());
        const currentDate = (new Date(new Date(dateToTest)).toUTCString());
        return currentDate <= start && currentDate >= end;
    }
 }