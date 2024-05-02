import { ServicePayload, Payload } from "../Payload";
import { ChainNativeApi } from "./ChainNativeApi";

export class IdentityService {
    static async getInfo(identityValue: string, height?: number): Promise<ServicePayload> {
        try {
            var data: any;
            const response: any = await ChainNativeApi.getIdentity(identityValue, height);
            if(response.status != 200 || response.data.error) {
                Payload.logError(
                    'fetch identity info',
                    `Identity: ${identityValue}`,
                    `getInfo`);
                return Payload.withError();
            }
            
            data = response.data.result;
            if(data === undefined) { return Payload.withError(); }

            return Payload.withSuccess(data);
        } catch(e) {
            Payload.logError(
                'fetch identity info - [Exception] : ' + e,
                `Identity: ${identityValue}`,
                `getInfo`);
            return Payload.withError();
        }
    }
}