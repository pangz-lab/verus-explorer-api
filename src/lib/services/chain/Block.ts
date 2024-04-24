import { ServicePayload, Payload } from "../payload/Payload";
import { ChainNativeApi } from "./ChainNativeApi";

export class Block {
    static async getInfo(blockHeightOrHash: string | number): Promise<ServicePayload> {
        try {
            var data: any;
            const response: any = await ChainNativeApi.getBlockDetail(blockHeightOrHash);
            if(response.status != 200 || response.data.error) {
                Payload.logError(
                    'fetch block info',
                    `Data: ${blockHeightOrHash}`,
                    `getInfo`);
                return Payload.withError();
            }

            data = response.data.result;
            if(data.height == undefined) { return Payload.withError(); }

            return Payload.withSuccess(data);
        } catch(e) {
            Payload.logError(
                'fetch block info',
                `Data: ${blockHeightOrHash}`,
                `getInfo`);
            return Payload.withError();
        }
    }

    static async getHashesByRange(start: number, end: number): Promise<ServicePayload> {
        const rangeLabel = start.toString() + '_' + end.toString();
        try {
            var data: any;
            const response: any = await ChainNativeApi.getBlockHashes(
                [start.toString(), end.toString()]
            );
            if(response.status != 200 || response.data.error) {
                Payload.logError(
                    'fetch block hashes',
                    `Range: ${rangeLabel}`,
                    `getHashesByRange`);
                return Payload.withError();
            }
            
            data = response.data.result;
            if(data == undefined || data.length === 0) { return Payload.withError(); }

            return Payload.withSuccess(data);
        } catch(e) {
            Payload.logError(
                'fetch block hashes',
                `Range: ${rangeLabel}`,
                `getHashesByRange`);
            return Payload.withError();
        }
    }

    static async getGeneratedFromHash(hashList: string[]): Promise<ServicePayload> {
        var result: Object[] = [];
        var data: any;
        var currentHash: string = '';

        for(var i = 0; i < hashList.length; i++) {
            try {
                currentHash = hashList[i];
                const response: any = await ChainNativeApi.getBlockDetail(currentHash);
                if(response.status != 200 || response.data.error) {
                    Payload.logError(
                        'fetch block from hash',
                        `Hash: ${currentHash}`,
                        `getGeneratedFromHash`);
                    continue;
                }

                data = response.data.result;
            } catch(e) {
                Payload.logError(
                    'fetch block from hash',
                    `Hash: ${currentHash}`,
                    `getGeneratedFromHash`);
            }

            result.push({
                hash: data?.hash ?? '',
                height: data?.height ?? '',
                time: data?.time ?? 0,
                txCount: data?.tx?.length ?? 0
            });
        }
        return Payload.withSuccess(result);
    }

    static async getSummary(blockHeight: number): Promise<undefined | Object> {
        try {
            var data: any;
            const blockInfo: any = await Block.getInfo(blockHeight);
            if(blockInfo.error) { throw new Error("Error found while getting the block information."); }
            
            data = await Block.saveSummary(blockInfo.data);
            if(data == undefined) { throw new Error("Error found while saving the block summary."); }
            
            return data;
        } catch (e) {
            Payload.logError(
                'get the block summary',
                `Error: ${e}`,
                `getSummary`);
            return undefined;
        }
    }

    static async saveSummary(blockInfo: any): Promise<undefined | Object> {
        try {
            const blockHeight = blockInfo!.height;
            var data: any;
            if(data != undefined && data.height) { return data; }

            data = {
                'anchor': blockInfo!.anchor,
                'bits': blockInfo!.bits,
                'blocktype': blockInfo!.blocktype,
                'difficulty': blockInfo!.difficulty,
                'hash': blockInfo!.hash,
                'height': blockInfo!.height,
                'nonce': blockInfo!.nonce,
                'previousblockhash': blockInfo!.previousblockhash,
                'size': blockInfo!.size,
                'segid': blockInfo!.segid,
                'time': blockInfo!.time,
                'version': blockInfo!.version,
                'txs': blockInfo!.tx,
            }
            return data;
        } catch (e) {
            Payload.logError(
                'save the block summary',
                `Error: ${e}`,
                `saveSummary`); 
            return undefined;
        }
    }

}