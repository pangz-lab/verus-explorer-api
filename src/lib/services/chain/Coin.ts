import { Payload } from "../payload/Payload";
import { ChainNativeApi } from "./ChainNativeApi";

export class Coin {
    static async getSupplyInfo(): Promise<Object> {
        try {
            var data: any;
            const response: any = await ChainNativeApi.getCoinSupply();
            if(response.status != 200 || response.data.error) {
                Payload._showError(
                    'fetch coin supply info',
                    `Data: -`,
                    `getSupplyInfo`);
                return Payload._errorPayload();
            }
            
            data = response.data.result;
            if(data == undefined) { return Payload._errorPayload(); }

            return Payload._successPayload(data);
        } catch(e) {
            Payload._showError(
                'fetch coin supply info',
                `Data: -`,
                `getSupplyInfo`);
            return Payload._errorPayload();
        }
    }
}