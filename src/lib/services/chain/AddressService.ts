import { ServicePayload, Payload } from "../payload/Payload";
import { ChainNativeApi } from "./ChainNativeApi";

export class AddressService {
    static async getTxIds(address: string): Promise<ServicePayload> {
        try {
            var data: any;
            const response: any = await ChainNativeApi.getAddressTxIds([address]);
            if(response.status != 200 || response.data.error) {
                Payload.logError(
                    'fetch address txids',
                    `Address: ${address}`,
                    `getTxIds`);
                return Payload.withError();
            }
            
            data = response.data.result;
            if(data === undefined) { return Payload.withError(); }
            
            return Payload.withSuccess(data);
        } catch(e) {
            Payload.logError(
                'fetch address txids - [Exception] : ' + e,
                `Address: ${address}`,
                `getTxIds`);
            return Payload.withError();
        }
    }

    static async getBalance(address: string): Promise<ServicePayload> {
        try {
            var data: any;
            const response: any = await ChainNativeApi.getAddressBalance([address]);
            if(response.status != 200 || response.data.error) {
                Payload.logError(
                    'fetch address balance',
                    `Address: ${address}`,
                    `getBalance`);
                return Payload.withError();
            }
            
            data = response.data.result;
            if(data === undefined) { return Payload.withError(); }
            return Payload.withSuccess(data);
        } catch(e) {
            Payload.logError(
                'fetch address balance - [Exception] : ' + e,
                `Address: ${address}`,
                `getBalance`);
            return Payload.withError();
        }
    }
}