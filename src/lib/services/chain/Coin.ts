import { Payload } from "../payload/Payload";
import { ChainNativeApi } from "./ChainNativeApi";

export class Coin {
    static async getCoinSupplyInfo(): Promise<Object> {
        // const cacheKey = CacheKeys.CoinSupplyInfo;
        // const CACHE_EXP_COIN_SUPPLY_INFO = 43200;
        
        try {
            var data: any;
            // data = await this.cache.get(cacheKey);
            if(data == undefined) {
                const response: any = await ChainNativeApi.getCoinSupply();
                if(response.status != 200 || response.data.error) {
                    Payload._showError(
                        'fetch coin supply info',
                        `Data: -`,
                        `getBlockchainHeight`);
                    return Payload._errorPayload();
                }
                
                data = response.data.result;
                if(data == undefined) { return Payload._errorPayload(); }
                // this.cache.set(cacheKey, data, CACHE_EXP_COIN_SUPPLY_INFO);
            }

            return Payload._successPayload(data);
        } catch(e) {
            Payload._showError(
                'fetch mining info',
                `Data: -`,
                `getMiningInfo`);
            return Payload._errorPayload();
        }
    }
}