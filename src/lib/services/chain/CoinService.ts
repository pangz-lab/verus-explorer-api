import { Payload } from "../Payload";
import { ChainNativeApi } from "./ChainNativeApi";

export class CoinService {
    static async getSupplyInfo(): Promise<Object> {
        try {
            var data: any;
            const response: any = await ChainNativeApi.getCoinSupply();
            if(response.status != 200 || response.data.error) {
                Payload.logError(
                    'fetch coin supply info',
                    `Data: -`,
                    `getSupplyInfo`);
                return Payload.withError();
            }
            
            data = response.data.result;
            if(data === undefined) { return Payload.withError(); }

            return Payload.withSuccess(data);
        } catch(e) {
            Payload.logError(
                'fetch coin supply info - [Exception] : ' + e,
                `Data: -`,
                `getSupplyInfo`);
            return Payload.withError();
        }
    }
}