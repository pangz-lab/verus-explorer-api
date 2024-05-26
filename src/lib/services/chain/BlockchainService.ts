import { ChainNativeApi } from "./ChainNativeApi";
import { ServicePayload, Payload } from "../Payload";

export type BlockchainStatusSummary = {
    VRSCversion: string,
    protocolVersion: string,
    blocks: number,
    longestchain: number,
    connections: number,
    difficulty: number,
    version: string,
    networkHashrate: number,
    circulatingSupply: number,
    circulatingSupplyTotal: number,
    circulatingZSupply: number,
}

export class BlockchainService {
    static async getInfo(): Promise<ServicePayload> {
        try {
            var data: any;
            const response: any = await ChainNativeApi.getInfo();
            if(response.status != 200 || response.data.error) {
                Payload.logError(
                    'fetch blockchain info',
                    `Data: -`,
                    `getInfo`);
                return Payload.withError();
            }
            
            data = response.data.result;
            if(data === undefined) { return Payload.withError(); }

            return Payload.withSuccess(data);
        } catch(e) {
            Payload.logError(
                'fetch blockchain info - [Exception] : ' + e,
                `Data: -`,
                `getInfo`); 
            return Payload.withError();
        }
    }
    
    static async getMiningInfo(): Promise<ServicePayload> {
        try {
            var data: any;
            const response: any = await ChainNativeApi.getMiningInfo();
            if(response.status != 200 || response.data.error) {
                Payload.logError(
                    'fetch mining info',
                    `Data: -`,
                    `getMiningInfo`);
                return Payload.withError();
            }
            
            data = response.data.result;
            if(data === undefined) { return Payload.withError(); }

            return Payload.withSuccess(data);
        } catch(e) {
            Payload.logError(
                'fetch mining info - [Exception] : ' + e,
                `Data: -`,
                `getMiningInfo`);
            return Payload.withError();
        }
    }

    static async getHeight(): Promise<ServicePayload> {
        try {
            var data: any;
            const response: any = await ChainNativeApi.getBlockCount();
            if(response.status != 200 || response.data.error) {
                Payload.logError(
                    'fetch blockchain height',
                    `Data: -`,
                    `getHeight`);
                return Payload.withError();
            }
            
            data = response.data.result;
            if(data === undefined) { return Payload.withError(); }
        } catch(e) {
            Payload.logError(
                'fetch blockchain height - [Exception] : ' + e,
                `Data: -`,
                `getHeight`); 
            return Payload.withError();
        }

        return Payload.withSuccess(data);
    }

    // static async getStatus(): Promise<ServicePayload> {
    //     try {
    //         var requests = [
    //             BlockchainService.getInfo(),
    //             BlockchainService.getMiningInfo(),
    //             CoinService.getSupplyInfo()
    //         ];

    //         const result: any = await Promise.all(requests);
    //         if(result.at(0)!.error 
    //             || result.at(1)!.error 
    //             || result.at(2)!.error) {
    //                 Payload.logError(
    //                     'fetch blockchain status',
    //                     `Data: -`,
    //                     `getStatus`);
    //             return Payload.withError();
    //         }

    //         return Payload.withSuccess(result);
    //     } catch (e) {
    //         Payload.logError(
    //             'fetch blockchain status - [Exception] : ' + e,
    //             `Data: -`,
    //             `getStatus`);
    //     }
    // }

    // static async getStatusSummary(): Promise<ServicePayload> {
    //     const result: ServicePayload = await BlockchainService.getStatus();
    //     if(result === undefined || result!.error) { return undefined; }

    //     const statsData: any = result.data;
    //     const r1 = statsData.at(0)!.data;
    //     const r2 = statsData.at(1)!.data;
    //     const r3 = statsData.at(2)!.data;

    //     return Payload.withSuccess<BlockchainStatusSummary>({
    //         // R1
    //         VRSCversion: 'v' + r1.VRSCversion,
    //         protocolVersion: r1.protocolversion,
    //         blocks: r1.blocks,
    //         longestchain: r1.longestchain,
    //         connections: r1.connections,
    //         difficulty: r1.difficulty,
    //         version: r1.version,
    //         // R2
    //         networkHashrate: r2.networkhashps,
    //         // R3
    //         circulatingSupply: r3.supply,
    //         circulatingSupplyTotal: r3.total,
    //         circulatingZSupply: r3.zfunds,
    //     });
    // }

    // static async getCurrentState(blockHeightOrHash?: string): Promise<LatestChainStatePayload> {
    //     if(blockHeightOrHash === undefined) {
    //         const currentHeight = await BlockchainService.getHeight();
    //         if(currentHeight === undefined || currentHeight.error) { return undefined; }
    //         blockHeightOrHash = currentHeight.data.toString();
    //     }

    //     const blockInfo: any = await BlockService.getInfo(blockHeightOrHash as string);
    //     if(blockInfo === undefined || blockInfo.error || !blockInfo.data) { return undefined; }
    
    //     const chainHeight: number = blockInfo.data.height;
    //     if(BlockchainService.lastProcessedHeight >= chainHeight) { return undefined; }

    //     const blockSummary: any = await BlockService.getBasicInfo(blockInfo.data);
    //     if(blockSummary === undefined) { return undefined; }
        
    //     var blockTxs: string[] = [];
    //     blockSummary.txs.map((e: string) => { if(!blockTxs.includes(e)) { blockTxs.push(e); } });
    //     //TODO - Improve this, remove reverse
    //     blockTxs.reverse();

    //     BlockchainService.lastProcessedHeight = chainHeight;
    //     const txsInfo = await TransactionService.getBlockTxsInfoSummary(blockTxs);

    //     const chainStatusSummary = await BlockchainService.getStatusSummary();
    //     if(chainStatusSummary === undefined) { return undefined; }
        
    //     const chainState = await BlockchainService.setChainState(chainStatusSummary, blockSummary.hash);

    //     const latestBlock = { data: blockSummary, error: false };
    //     const latestTxs = { data: txsInfo, error: false };
    //     const nodeState = { data: chainState, error: false };

    //     const payload: LatestChainStatePayload = {
    //         status: chainStatusSummary,
    //         latestBlock: latestBlock,
    //         latestTxs: latestTxs,
    //         nodeState: nodeState,
    //     };
    //     return payload;
    // }

    // private static async setChainState(chainStatusSummary: ServicePayload, currentBlockHash: string)
    // : Promise<ChainNodeState | undefined> {
    //     const summary = chainStatusSummary!.data as BlockchainStatusSummary;
    //     var longestChainHash = currentBlockHash;
    //     if(summary.blocks != summary.longestchain) {
    //         const longestChainInfo: any = await BlockService.getInfo(summary.longestchain.toString());
    //         if(longestChainInfo === undefined || longestChainInfo.error || !longestChainInfo.data) {
    //             longestChainHash = "-1";
    //         }
    //     }
    //     ChainNode.setState({
    //         sync: summary.blocks == summary.longestchain,
    //         blocks: summary.blocks,
    //         longestChain: summary.longestchain,
    //         blockHash: currentBlockHash,
    //         longestChainBlockHash: longestChainHash,
    //         syncPercentage: undefined,
    //         message: undefined,
    //     });

    //     return ChainNode.getState();
    // }
}