import { ServicePayload, Payload } from "../payload/Payload";
import { ChainNativeApi } from "./ChainNativeApi";

export class Identity {
    static async getInfo(identityValue: string, height?: number): Promise<ServicePayload> {
        try {
            var data: any;
            const response: any = await ChainNativeApi.getIdentity(identityValue, height);
            if(response.status != 200 || response.data.error) {
                Payload._showError(
                    'fetch identity info',
                    `Identity: ${identityValue}`,
                    `getInfo`);
                return Payload._errorPayload();
            }
            
            data = response.data.result;
            if(data == undefined) { return Payload._errorPayload(); }

            return Payload._successPayload(data);
        } catch(e) {
            Payload._showError(
                'fetch identity info',
                `Identity: ${identityValue}`,
                `getInfo`);
            return Payload._errorPayload();
        }
    }
}