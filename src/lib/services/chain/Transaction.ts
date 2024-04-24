import { ServicePayload, Payload } from "../payload/Payload";
import { ChainNativeApi } from "./ChainNativeApi";

export class Transaction {
    static async getInfo(blockHeightOrHash: string): Promise<ServicePayload> {
        // const cacheKey = CacheKeys.TxInfoPrefix + blockHeightOrHash;
        // const CACHE_EXP_TRANSACTION_INFO = 86400;
        
        try {
            // data = await this.cache.get(cacheKey);
            var data: any;
            // if(data == undefined) {
                const response: any = await ChainNativeApi.getTransactionInfo(blockHeightOrHash);
                if(response.status != 200 || response.data.error) {
                    Payload._showError(
                        'fetch transaction info',
                        `Data: ${blockHeightOrHash!}`,
                        `getInfo`);
                    return Payload._errorPayload();
                }

                data = response.data.result;
                if(data == undefined) { return Payload._errorPayload();}
                // this.cache.set(cacheKey, data, CACHE_EXP_TRANSACTION_INFO);
            // }

            return Payload._successPayload(data);

        } catch(e) {
            Payload._showError(
                'fetch transaction info',
                `Data: ${blockHeightOrHash!}`,
                `getInfo`); 
            return Payload._errorPayload();
        }
    }

    static async decodeRaw(hexString: string): Promise<Object> {
        // const cacheKey = CacheKeys.BlockRawTransactionPrefix + hexString.slice(-32);
        
        // data = await this.cache.get(cacheKey);
        try {
            var data: any;
            // if(data == undefined) {
                const response: any = await ChainNativeApi.decodeBlockRawTransaction(hexString);
                if(response.status != 200 || response.data.error) {
                    Payload._showError(
                        'fetch decoded block raw transaction',
                        `Key: -`,
                        `decodeRaw`);
                    return Payload._errorPayload();
                }
                
                data = response.data.result;
                if(data == undefined) { return Payload._errorPayload(); }
                // this.cache.set(cacheKey, data);
            // }
    
            return Payload._successPayload(data);
        } catch (e) {
            Payload._showError(
                'fetch decoded block raw transaction',
                // `Key: ${cacheKey}`,
                `Key: -`,
                `decodeRaw`);
            return Payload._errorPayload();
        }
    }
}