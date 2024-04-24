import { ServicePayload, Payload } from "../payload/Payload";
import { ChainNativeApi } from "./ChainNativeApi";

export class Address {
    static async getTxIds(address: string): Promise<ServicePayload> {
        // const cacheKey = CacheKeys.AddressTxListPrefix + address;
        // const CACHE_EXP_ADDRESS_TX_IDS = 3*60; //3 minutes
        try {
            
            var data: any;
            // data = await this.cache.get(cacheKey);
            // if(data == undefined) {
                const response: any = await ChainNativeApi.getAddressTxIds([address]);
                if(response.status != 200 || response.data.error) {
                    Payload._showError(
                        'fetch address txids',
                        `Address: ${address}`,
                        `getTxIds`);
                    return Payload._errorPayload();
                }
                
                data = response.data.result;
                if(data == undefined) { return Payload._errorPayload(); }
                // this.cache.set(cacheKey, data, CACHE_EXP_ADDRESS_TX_IDS);
            // }

            return Payload._successPayload(data);
        } catch(e) {
            Payload._showError(
                'fetch address txids',
                `Address: ${address}`,
                `getTxIds`);
            return Payload._errorPayload();
        }
    }

    static async getBalance(address: string): Promise<ServicePayload> {
        // const cacheKey = CacheKeys.AddressBalancePrefix + address;
        // const CACHE_EXP_ADDRESS_BALANCE = 5*60; //5 minutes
        
        try {
            var data: any;
            // data = await this.cache.get(cacheKey);
            // if(data == undefined) {
                const response: any = await ChainNativeApi.getAddressBalance([address]);
                if(response.status != 200 || response.data.error) {
                    Payload._showError(
                        'fetch address balance',
                        `Address: ${address}`,
                        `getBalance`);
                    return Payload._errorPayload();
                }
                
                data = response.data.result;
                if(data == undefined) { return Payload._errorPayload(); }
                // this.cache.set(cacheKey, data, CACHE_EXP_ADDRESS_BALANCE);
            // }

            return Payload._successPayload(data);
        } catch(e) {
            Payload._showError(
                'fetch address balance',
                `Address: ${address}`,
                `getBalance`);
            return Payload._errorPayload();
        }
    }
}