import { ServicePayload, Payload } from "../payload/Payload";
import { ChainNativeApi } from "./ChainNativeApi";

export class Identity {
    static async getInfo(identityValue: string, height?: number): Promise<ServicePayload> {
        // const cacheKey = CacheKeys.IdentityInfoPrefix + identityName + 
        //  (height != undefined ? '_' + height?.toString() : '');
        // const CACHE_EXP_IDENTITY_INFO = 600; //10 minutes
        
        try {
            var data: any;
            // data = await this.cache.get(cacheKey);
            // if(data == undefined) {
                const response: any = await ChainNativeApi.getIdentity(identityValue, height);
                if(response.status != 200 || response.data.error) {
                    Payload._showError(
                        'fetch identity info',
                        `Identity: ${identityValue}`,
                        `getInfo`);
                    return Payload._errorPayload();
                }
                
                data = response.data.result;
                if(data == undefined) { return Payload._errorPayload(); }
                // this.cache.set(cacheKey, data, CACHE_EXP_IDENTITY_INFO);
            // }

            return Payload._successPayload(data);
        } catch(e) {
            Payload._showError(
                'fetch identity info',
                `Identity: ${identityValue}`,
                `getInfo`);
            return Payload._errorPayload();
        }
    }
}