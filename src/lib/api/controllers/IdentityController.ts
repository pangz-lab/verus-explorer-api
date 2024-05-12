import { Request, Response } from 'express';
import { PayloadCache } from '../../services/caching/Caching';
import { CacheKeys } from '../../services/caching/CacheKeys';
import { ServicePayload } from '../../services/Payload';
import { IdentityService } from "../../services/chain/IdentityService";
import { IdentityValidator } from '../../services/Validator';
import { Logger } from '../../services/Logger';

export class IdentityController {
    static async info(req: Request, res: Response) {
        try {
            const identity = req.params.id as string;
            const startHeightExist = (req.query.height != undefined);
            const height = !startHeightExist ? undefined : parseInt((req.query.height ?? '').toString());

            if(!IdentityValidator.isValidVerusId(identity.replace('@', '')) 
                || (startHeightExist && Number.isNaN(height))) {
                return res.status(400).send("Invalid request!");
            }

            const keyExt = (height != undefined ? '_' + height?.toString() : '');
            const cacheKey = CacheKeys.IdentityInfoPrefix.key + identity + keyExt;
            const ttl = CacheKeys.IdentityInfoPrefix.ttl;
            
            const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
                source: async () => await IdentityService.getInfo(identity, height),
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
}