import { ServicePayload, Payload } from "../payload/Payload";
import { ChainNativeApi } from "./ChainNativeApi";

export class Transaction {
    static async getInfo(blockHeightOrHash: string): Promise<ServicePayload> {
        try {
            var data: any;
            const response: any = await ChainNativeApi.getTransactionInfo(blockHeightOrHash);
            if(response.status != 200 || response.data.error) {
                Payload.logError(
                    'fetch transaction info',
                    `Data: ${blockHeightOrHash!}`,
                    `getInfo`);
                return Payload.withError();
            }

            data = response.data.result;
            if(data == undefined) { return Payload.withError();}

            return Payload.withSuccess(data);
        } catch(e) {
            Payload.logError(
                'fetch transaction info',
                `Data: ${blockHeightOrHash!}`,
                `getInfo`); 
            return Payload.withError();
        }
    }

    static async decodeRaw(hexString: string): Promise<Object> {
        try {
            var data: any;
            const response: any = await ChainNativeApi.decodeBlockRawTransaction(hexString);
            if(response.status != 200 || response.data.error) {
                Payload.logError(
                    'fetch decoded block raw transaction',
                    `Key: -`,
                    `decodeRaw`);
                return Payload.withError();
            }
            
            data = response.data.result;
            if(data == undefined) { return Payload.withError(); }

            return Payload.withSuccess(data);
        } catch (e) {
            Payload.logError(
                'fetch decoded block raw transaction',
                `Key: -`,
                `decodeRaw`);
            return Payload.withError();
        }
    }
}