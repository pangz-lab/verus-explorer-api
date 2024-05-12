import { Request, Response } from 'express';
import { PayloadCache } from '../services/caching/Caching';
import { CacheKeys } from '../services/caching/CacheKeys';
import { ServicePayload } from '../services/Payload';
import { Hashing } from '../services/Hashing';
import { SearchService } from "../services/chain/SearchService";
import { Logger } from '../services/Logger';

export class SearchController {
    static async query(req: Request, res: Response) {
        try {
            const query = req.query.q as string;
            if(query.length > 200) { return res.status(400).send("Invalid request!");}

            const queryChecksum = Hashing.createChecksum(query);
            const cacheKey = CacheKeys.SearchQueryPrefix.key + queryChecksum;
            const ttl = CacheKeys.SearchQueryPrefix.ttl;
            
            const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
                source: async () => await SearchService.findQuery(query),
                onAbortSave: (r) => false,
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
}