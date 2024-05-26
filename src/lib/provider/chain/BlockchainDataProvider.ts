import { CacheKeys } from "../../services/caching/CacheKeys";
import { Caching, PayloadCache } from "../../services/caching/Caching";
import { BlockService } from "../../services/chain/BlockService";
import { CoinService } from "../../services/chain/CoinService";
import { TransactionService } from "../../services/chain/TransactionService";
import { ChainNodeState, ChainNode } from "../../services/ChainNode";
import { LatestChainStatePayload, Payload, ServicePayload } from "../../services/Payload";
import { BlockchainService, BlockchainStatusSummary } from "../../services/chain/BlockchainService";

export class BlockchainDataProvider {
    // private static lastProcessedHeight = 0;
    private static async getLastProcessedHeight(): Promise<number>{
        const cacheKey = CacheKeys.ChainLastProcessedHeight.key;
        const r = await Caching.get<number>(cacheKey);
        if(r === undefined) { return 0; }
        return parseInt(r.toString());
    }
    
    private static setLastProcessedHeight(height: number): void {
        const cacheKey = CacheKeys.ChainLastProcessedHeight.key;
        const ttl = CacheKeys.ChainLastProcessedHeight.ttl;
        Caching.set(cacheKey, height, ttl);
    }

    static async getCurrentState(blockHeightOrHash?: string): Promise<LatestChainStatePayload> {
        const cacheKey = CacheKeys.BlockchainStatus.key;
        const ttl = CacheKeys.BlockchainStatus.ttl;
        const lastSavedState: LatestChainStatePayload = await Caching.get(cacheKey);

        if(blockHeightOrHash === undefined) {
            const currentHeight = await BlockchainService.getHeight();
            if(currentHeight === undefined || currentHeight.error) { return undefined; }
            blockHeightOrHash = currentHeight.data.toString();
        }
        const blockInfo: any = await BlockService.getInfo(blockHeightOrHash as string);
        if(blockInfo === undefined || blockInfo.error || !blockInfo.data) { return lastSavedState; }

        const chainHeight: number = blockInfo.data.height;
        const lastProcessedHeight = await BlockchainDataProvider.getLastProcessedHeight();
        if(lastProcessedHeight >= chainHeight) { return lastSavedState; }
        BlockchainDataProvider.setLastProcessedHeight(chainHeight);

        const blockSummary: any = await BlockService.getBasicInfo(blockInfo.data);
        if(blockSummary === undefined) { return lastSavedState; }

        var blockTxs: string[] = [];
        blockSummary.txs.map((e: string) => { if(!blockTxs.includes(e)) { blockTxs.push(e); } });
        //TODO - Improve this, remove reverse
        blockTxs.reverse();
        const txsInfo = await TransactionService.getBlockTxsInfoSummary(blockTxs);

        const chainStatusSummary = await BlockchainDataProvider.getStatusSummary();
        if(chainStatusSummary === undefined) { return lastSavedState; }
        
        const chainState = await BlockchainDataProvider.setChainState(chainStatusSummary, blockSummary.hash);

        const latestBlock = { data: blockSummary, error: false };
        const latestTxs = { data: txsInfo, error: false };
        const nodeState = { data: chainState, error: false };

        const payload: LatestChainStatePayload = {
            status: chainStatusSummary,
            latestBlock: latestBlock,
            latestTxs: latestTxs,
            nodeState: nodeState,
        };
        Caching.set(cacheKey, payload, ttl);
        return payload;
    }

    static async getStatus(): Promise<ServicePayload> {
        try {
            const cacheKey = CacheKeys.ChainCurrentStatePrefix.key;
            const ttl = CacheKeys.ChainCurrentStatePrefix.ttl;

            const requests = [
                BlockchainService.getInfo(),
                PayloadCache.get<ServicePayload>({
                    source: async () => await BlockchainService.getMiningInfo(),
                    abortSaveOn: (r) => r === undefined || (r != undefined && r.error),
                    key: cacheKey + 'mining_info',
                    ttl: ttl
                }),
                PayloadCache.get<ServicePayload>({
                    source: async () => await CoinService.getSupplyInfo(),
                    abortSaveOn: (r) => r === undefined || (r != undefined && r.error),
                    key: cacheKey + 'supply_info',
                    ttl: ttl
                })
            ];

            const result: any = await Promise.all(requests);
            if(result.at(0)!.error 
                || result.at(1)!.error 
                || result.at(2)!.error) {
                    Payload.logError(
                        'fetch blockchain status',
                        `Data: -`,
                        `getStatus`);
                return Payload.withError();
            }

            return Payload.withSuccess(result);
        } catch (e) {
            Payload.logError(
                'fetch blockchain status - [Exception] : ' + e,
                `Data: -`,
                `getStatus`);
        }
    }

    private static async getStatusSummary(): Promise<ServicePayload> {
        const result: ServicePayload = await BlockchainDataProvider.getStatus();
        if(result === undefined || result!.error) { return undefined; }

        const statsData: any = result.data;
        const r1 = statsData.at(0)!.data;
        const r2 = statsData.at(1)!.data;
        const r3 = statsData.at(2)!.data;

        return Payload.withSuccess<BlockchainStatusSummary>({
            // R1
            VRSCversion: 'v' + r1.VRSCversion,
            protocolVersion: r1.protocolversion,
            blocks: r1.blocks,
            longestchain: r1.longestchain,
            connections: r1.connections,
            difficulty: r1.difficulty,
            version: r1.version,
            // R2
            networkHashrate: r2.networkhashps,
            // R3
            circulatingSupply: r3.supply,
            circulatingSupplyTotal: r3.total,
            circulatingZSupply: r3.zfunds,
        });
    }

    private static async setChainState(chainStatusSummary: ServicePayload, currentBlockHash: string)
    : Promise<ChainNodeState | undefined> {
        const summary = chainStatusSummary!.data as BlockchainStatusSummary;
        var longestChainHash = currentBlockHash;
        if(summary.blocks != summary.longestchain) {
            const longestChainInfo: any = await BlockService.getInfo(summary.longestchain.toString());
            if(longestChainInfo === undefined || longestChainInfo.error || !longestChainInfo.data) {
                longestChainHash = "-1";
            }
        }
        ChainNode.setState({
            sync: summary.blocks == summary.longestchain,
            blocks: summary.blocks,
            longestChain: summary.longestchain,
            blockHash: currentBlockHash,
            longestChainBlockHash: longestChainHash,
            syncPercentage: undefined,
            message: undefined,
        });

        return ChainNode.getState();
    }
}