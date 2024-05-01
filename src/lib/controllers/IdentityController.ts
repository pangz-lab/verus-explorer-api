import { Request, Response } from 'express';
import { PayloadCache } from '../services/caching/Caching';
import { CacheKeys } from '../services/caching/CacheKeys';
import { ServicePayload } from '../services/payload/Payload';
import { IdentityService } from "../services/chain/IdentityService";
import { IdentityValidator } from '../services/Validator';
import { Logger } from '../services/Logger';
import { HttpRequestPayload } from '../models/HttpRequestPayload';

export class IdentityController {
    static async info(req: Request, res: Response) {
        try {
            const body = req.body as HttpRequestPayload;
            const identityValue = body.params![0]!.toString();
            const height = body.params![1]! != undefined? parseInt(body.params![1]!.toString()) : undefined;

            if(!IdentityValidator.isValidVerusId(identityValue.replace("@", "")) 
                || (height != undefined && Number.isNaN(height))) {
                return res.status(400).send("Invalid request!");
            }

            const keyExt = (height != undefined ? '_' + height?.toString() : '');
            const cacheKey = CacheKeys.IdentityInfoPrefix.key + identityValue + keyExt;
            const ttl = CacheKeys.IdentityInfoPrefix.ttl;
            
            const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
                source: async () => await IdentityService.getInfo(identityValue, height),
                onReturnUndefinedIf: (r) => r === undefined || (r != undefined && r.error),
                key: cacheKey,
                ttl: ttl
            });

            if(resBody === undefined) { return res.status(404).send("Failed to retrieve the data!"); }
            res.send(resBody);
        } catch(e) {
            Logger.toErrorLog('[HTTP Error]'+ (e as string));
            return res.status(500).send("Internal server error!");
        }
    }
}