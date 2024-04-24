import { ServicePayload, Payload } from "../payload/Payload";
import { ChainNativeApi } from "./ChainNativeApi";
import { Coin } from "./Coin";

export class Blockchain {

    static async getInfo(): Promise<ServicePayload> {
        try {
            var data: any;
            const response: any = await ChainNativeApi.getInfo();
            if(response.status != 200 || response.data.error) {
                Payload._showError(
                    'fetch blockchain info',
                    `Data: -`,
                    `getInfo`);
                return Payload._errorPayload();
            }
            
            data = response.data.result;
            if(data == undefined) { return Payload._errorPayload(); }

            return Payload._successPayload(data);
        } catch(e) {
            Payload._showError(
                'fetch blockchain info',
                `Data: -`,
                `getInfo`); 
            return Payload._errorPayload();
        }
    }
    
    static async getMiningInfo(): Promise<ServicePayload> {
        try {
            var data: any;
            const response: any = await ChainNativeApi.getMiningInfo();
            if(response.status != 200 || response.data.error) {
                Payload._showError(
                    'fetch mining info',
                    `Data: -`,
                    `getMiningInfo`);
                return Payload._errorPayload();
            }
            
            data = response.data.result;
            if(data == undefined) { return Payload._errorPayload(); }

            return Payload._successPayload(data);
        } catch(e) {
            Payload._showError(
                'fetch mining info',
                `Data: -`,
                `getMiningInfo`);
            return Payload._errorPayload();
        }
    }

    static async getHeight(): Promise<ServicePayload> {
        try {
            var data: any;
            const response: any = await ChainNativeApi.getBlockCount();
            if(response.status != 200 || response.data.error) {
                Payload._showError(
                    'fetch blockchain height',
                    `Data: -`,
                    `getHeight`);
                return Payload._errorPayload();
            }
            
            data = response.data.result;
            if(data == undefined) { return Payload._errorPayload(); }
        } catch(e) {
            Payload._showError(
                'fetch blockchain height',
                `Data: -`,
                `getHeight`); 
            return Payload._errorPayload();
        }

        return Payload._successPayload(data);
    }

    static async getStatus(): Promise<ServicePayload> {
        try {
            var data: any;
            var requests = [
                Blockchain.getInfo(),
                Blockchain.getMiningInfo(),
                Coin.getSupplyInfo()
            ];

            const result: any = await Promise.all(requests);
            if(result.at(0)!.error 
                || result.at(1)!.error 
                || result.at(2)!.error) {
                    Payload._showError(
                        'fetch blockchain status',
                        `Data: -`,
                        `getStatus`);
                return Payload._errorPayload();
            }

            const r1 = result.at(0)!.data;
            const r2 = result.at(1)!.data;
            const r3 = result.at(2)!.data;
            data = {
                // R1
                'VRSCversion': 'v' + r1.VRSCversion,
                'protocolVersion': r1.protocolversion,
                'blocks': r1.blocks,
                'connections': r1.connections,
                'difficulty': r1.difficulty,
                'version': r1.version,
                //R2
                'networkHashrate': r2.networkhashps,
                // R3
                'circulatingSupply': r3.supply,
                'circulatingSupplyTotal': r3.total,
                'circulatingZSupply': r3.zfunds,
            };
        } catch (e) {
            Payload._showError(
                'fetch blockchain status',
                `Data: -`,
                `getStatus`);
        }

        return Payload._successPayload(data);
    }
    
}