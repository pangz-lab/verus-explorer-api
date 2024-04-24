import { ServicePayload, ErrorPayload, Payload, SuccessPayload } from "../payload/Payload";
import { ChainNativeApi } from "./ChainNativeApi";

export class Block {
    // getBlockInfo
    static async getInfo(blockHeightOrHash: string | number): Promise<ServicePayload> {
        // const cacheKeyByHash = CacheKeys.BlockInfoByHashPrefix + blockHeightOrHash;
        // const CACHE_EXP_BLOCK_INFO = 360;
        try {
            var data: any;
            // data = await this.cache.get(cacheKeyByHash);
            // if(data == undefined) {
                const response: any = await ChainNativeApi.getBlockDetail(blockHeightOrHash);
                if(response.status != 200 || response.data.error) {
                    Payload._showError(
                        'fetch block info',
                        `Data: ${blockHeightOrHash}`,
                        `getInfo`);
                    return Payload._errorPayload();
                }

                data = response.data.result;
                if(data.height == undefined) { return Payload._errorPayload(); }

                // this.cache.setBlockInfo(
                //     blockHeightOrHash.toString(),
                //     data.height,
                //     data,
                //     CACHE_EXP_BLOCK_INFO
                // );
            // }

            return Payload._successPayload(data);
        } catch(e) {
            Payload._showError(
                'fetch block info',
                `Data: ${blockHeightOrHash}`,
                `getInfo`);
            return Payload._errorPayload();
        }
    }

    static async getHashesByRange(start: number, end: number): Promise<ServicePayload> {
        const rangeLabel = start.toString() + '_' + end.toString();
        // const cacheKey = CacheKeys.BlockHashesListPrefix + rangeLabel;
        // const isDateRangeWithinToday = this._isDateWithinRange(start, end, Math.floor(Date.now() / 1000));
        // const isOneDayRange = ((start - end)/60/60) == 24;
        // const useCache = isOneDayRange && !isDateRangeWithinToday;
        // const CACHE_EXP_BLOCK_HASHES_BY_RANGE = 216000
        try {
            var data: any;
            // if(useCache) { data = await this.cache.get(cacheKey); }
            // if(data == undefined) {
                const response: any = await ChainNativeApi.getBlockHashes(
                    [start.toString(), end.toString()]
                );
                if(response.status != 200 || response.data.error) {
                    Payload._showError(
                        'fetch block hashes',
                        `Range: ${rangeLabel}`,
                        `getHashesByRange`);
                    return Payload._errorPayload();
                }
                
                data = response.data.result;
                if(data == undefined || data.length === 0) { return Payload._errorPayload(); }
                // if(useCache) {
                //     this.cache.set(cacheKey, data, CACHE_EXP_BLOCK_HASHES_BY_RANGE);
                // }
            // }

            return Payload._successPayload(data);
        } catch(e) {
            Payload._showError(
                'fetch block hashes',
                `Range: ${rangeLabel}`,
                `getHashesByRange`);
            return Payload._errorPayload();
        }
    }

    // getGeneratedBlocks
    static async getGeneratedFromHash(hashList: string[]): Promise<ServicePayload> {
        // const CACHE_EXP_BLOCK_INFO = 300;
        var result: Object[] = [];
        var data: any;
        var currentHash: string = '';
        // var cacheKey: string;

        for(var i = 0; i < hashList.length; i++) {
            try {
                currentHash = hashList[i];
                // cacheKey = CacheKeys.BlockInfoByHashPrefix + currentHash;
                // data = await this.cache.get(cacheKey);
                // if(data == undefined) {
                    const response: any = await ChainNativeApi.getBlockDetail(currentHash);
                    if(response.status != 200 || response.data.error) {
                        Payload._showError(
                            'fetch block from hash',
                            `Hash: ${currentHash}`,
                            `getGeneratedFromHash`);
                        continue;
                    }

                    data = response.data.result;
                    // this.cache.setBlockInfo(
                    //     currentHash,
                    //     data.height,
                    //     data,
                    //     CACHE_EXP_BLOCK_INFO
                    // );
                // }
            } catch(e) {
                Payload._showError(
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
        return Payload._successPayload(result);
    }

    static async getSummary(blockHeight: number): Promise<undefined | Object> {
        // const cacheKey = CacheKeys.BlockSummaryPrefix + blockHeight.toString();
        
        try {
            // var data: any = await this.cache.get(cacheKey);
            var data: any;
            // if(data == undefined) {
                const blockInfo: any = await Block.getInfo(blockHeight);
                if(blockInfo.error) {
                    throw new Error("Error found while getting the block information.");
                }
                data = await Block.saveSummary(blockInfo.data);
                if(data == undefined) {
                    throw new Error("Error found while saving the block summary.");
                }
            // }
            
            return data;
        } catch (e) {
            Payload._showError(
                'get the block summary',
                `Error: ${e}`,
                `getSummary`);
            return undefined;
        }
    }

    static async saveSummary(blockInfo: any): Promise<undefined | Object> {
        try {
            const blockHeight = blockInfo!.height;
            // const cacheKey = CacheKeys.BlockSummaryPrefix + blockHeight.toString();

            // var data: any = await this.cache.get(cacheKey);
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
            // this.cache.set(cacheKey, data);
            return data;
        } catch (e) {
            Payload._showError(
                'save the block summary',
                `Error: ${e}`,
                `saveSummary`); 
            return undefined;
        }
    }

}