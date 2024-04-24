import { ServicePayload, Payload } from "../payload/Payload";
import { ChainNativeApi } from "./ChainNativeApi";

export class Address {
    static async getTxIds(address: string): Promise<ServicePayload> {
        try {
            var data: any;
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
        try {
            var data: any;
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