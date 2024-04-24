import crypto from 'crypto';
import { Request, Response } from 'express';
import { RpcRequestBody } from "verusd-rpc-ts-client/lib/types/RpcRequest";
import { CacheKeys } from '../services/caching/CacheKeys';
import { Caching } from '../services/caching/Caching';
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
        var resBody: ServicePayload;

        resBody = await Caching.get<ServicePayload>(cacheKey);
        if(resBody == undefined) {
            resBody = await BlockService.getGeneratedFromHash(hashList);
            if(resBody != undefined && resBody.error) {
                return res
                    .status(500)
                    .send("Internal server error!");
            }
            Caching.set(cacheKey, resBody, ttl);
        }
        
        res.send(resBody);
    }

    static async hashes(req: Request, res: Response) {
        const body = req.body as RpcRequestBody;
        const start = body.params![0] as number;
        const end = body.params![1] as number;
        const rangeLabel = start.toString() + '_' + end.toString();

        const cacheKey = CacheKeys.BlockHashesListPrefix.key + rangeLabel;
        const ttl = CacheKeys.BlockHashesListPrefix.ttl;
        var resBody: ServicePayload;

        const isDateRangeWithinToday = Block.isDateWithinRange(start, end, Math.floor(Date.now() / 1000));
        const isOneDayRange = ((start - end)/60/60) == 24;
        const useCache = isOneDayRange && !isDateRangeWithinToday;
        
        if(useCache) { resBody = await Caching.get<ServicePayload>(cacheKey); }
        if(resBody == undefined) {
            resBody = await BlockService.getHashesByRange(start, end);
            if(resBody != undefined && resBody.error) {
                return res
                    .status(500)
                    .send("Internal server error!");
            }
            if(useCache) { Caching.set(cacheKey, resBody, ttl); }
        }
        
        res.send(resBody);
    }

    static async info(req: Request, res: Response) {
        const body = req.body as RpcRequestBody;
        const blockHeightOrHash = body.params![0]! as string;
        
        const cacheKey = CacheKeys.BlockInfoByHashPrefix.key + blockHeightOrHash;
        const ttl = CacheKeys.BlockInfoByHashPrefix.ttl;
        var resBody: ServicePayload;
        
        resBody = await Caching.get<ServicePayload>(cacheKey);
        if(resBody == undefined) {
            resBody = await BlockService.getInfo(blockHeightOrHash);
            if(resBody != undefined && resBody.error) {
                return res
                    .status(500)
                    .send("Internal server error!");
            }
            Caching.set(cacheKey, resBody, ttl);
        }
        
        res.send(resBody);
    }

    private static isDateWithinRange(rangeStart: number, rangeEnd: number, dateToTest: number) {
        const start = (new Date(new Date(rangeStart)).toUTCString());
        const end = (new Date(new Date(rangeEnd)).toUTCString());
        const currentDate = (new Date(new Date(dateToTest)).toUTCString());
        return currentDate <= start && currentDate >= end;
    }
 }