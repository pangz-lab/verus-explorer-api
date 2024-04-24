import { ServicePayload, Payload } from "../payload/Payload";
import { ChainNativeApi } from "./ChainNativeApi";

export class Transaction {
    static async getInfo(blockHeightOrHash: string): Promise<ServicePayload> {
        try {
            var data: any;
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
        try {
            var data: any;
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

            return Payload._successPayload(data);
        } catch (e) {
            Payload._showError(
                'fetch decoded block raw transaction',
                `Key: -`,
                `decodeRaw`);
            return Payload._errorPayload();
        }
    }
}