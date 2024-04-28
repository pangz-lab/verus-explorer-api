import { Request, Response } from 'express';
import { PayloadCache } from '../services/caching/Caching';
import { CacheKeys } from '../services/caching/CacheKeys';
import { ServicePayload } from '../services/payload/Payload';
import { Hashing } from '../services/Hashing';
import { Search as SearchService } from "../services/chain/Search";

export class Search {
    static async query(req: Request, res: Response) {
        const query = req.query.q as string;
        
        const queryChecksum = Hashing.createChecksum(query);
        const cacheKey = CacheKeys.SearchQueryPrefix.key + queryChecksum;
        const ttl = CacheKeys.SearchQueryPrefix.ttl;
        
        const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
            source: async () => await SearchService.findQuery(query),
            onReturnUndefinedIf: (r) => false,
            key: cacheKey,
            ttl: ttl
        });


        if(resBody === undefined) { return res.status(404).send("Internal server error!"); }
        res.send(resBody);
    }
}