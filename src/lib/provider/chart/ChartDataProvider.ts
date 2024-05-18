import { CacheKeys } from "../../services/caching/CacheKeys";
import { PayloadCache } from "../../services/caching/Caching";
import { BlockchainService } from "../../services/chain/BlockchainService";
import { ChartService, DateRange } from "../../services/chart/ChartService";
import { BlockBasicInfo, BlockBasicInfoWithTx } from "../../models/BlockBasicInfo";
import { TransactionService, TxBasicInfo } from "../../services/chain/TransactionService";
import { ServicePayload } from "../../services/Payload";
import { MiningPoolStats } from "../../services/MiningPoolStats";
import { MiningStatsBasicInfo } from "../../models/MiningStats";

type ChartBlockTxsBasicInfo = {
    blockMiningDataTx: string,
    blockMiningReward: number,
    blockHighestVout: number,
    blockFeesPerTx: number[],
    blockTotalVoutPerTx: number[],
};

export class ChartDataProvider {
    private static stepsInMinutes = 10;

    static async getMiningStatsData(): Promise<undefined | MiningStatsBasicInfo[]> {
        const cacheKey = CacheKeys.StatsMiningDataPrefix.key+':miningData';
        const ttl = CacheKeys.StatsMiningDataPrefix.ttl;

        const result: ServicePayload = await PayloadCache.get<ServicePayload>({
            source: async () => await MiningPoolStats.getMiningData(),
            abortSaveOn: (r) => r === undefined || (r != undefined && r.error),
            key: cacheKey,
            ttl: ttl
        });

        if(result?.error || result?.data === undefined || result === undefined) { return undefined; }
        var stats: MiningStatsBasicInfo[] = [];
        const rawData = result.data as Array<any>;
        for(var i = 0; i < rawData.length; i++) {
            const data: any = rawData[i];
            stats[i] = {
                url: data.url,
                hashrate: data.hashrate,
                miners: data.miners,
                minpay: data.minpay,
                id: data.id,
                poolId: data.pool_id,
                i: data.i,
                fee: data.fee,
                country: data.country,
                feetype: data.feetype,
            };
        }
        
        return stats;
    }

    static async getBlockBasicInfoWithinRange(range: string, count: number): Promise<undefined | BlockBasicInfoWithTx[]> {
        const rawHeightPayload = await BlockchainService.getHeight();
        if(rawHeightPayload == undefined || rawHeightPayload.error) {
            return undefined;
        }
        var result: BlockBasicInfoWithTx[] = [];
        const height = parseInt(rawHeightPayload.data.toString());
        const cacheKey = CacheKeys.ChartRawDataShortPrefix.key + range;
        const ttl = CacheKeys.ChartRawDataShortPrefix.ttl;
        
        var queryResult = await PayloadCache.get<BlockBasicInfo[]>({
            source: async () => await ChartService.getDatasetFromHeight(height, count),
            abortSaveOn: (r) => r === undefined,
            key: cacheKey,
            ttl: ttl
        });

        if(queryResult !== undefined) {
            var finalResult: BlockBasicInfoWithTx[] = [];
            for(var blockIndex = 0; blockIndex < queryResult.length; blockIndex++) {
                
                const txDetail = await ChartDataProvider.getBlockTxsBasicInfo(queryResult[blockIndex].txs);
                finalResult[blockIndex] = queryResult[blockIndex] as BlockBasicInfoWithTx;
                finalResult[blockIndex].blockMiningDataTx = txDetail.blockMiningDataTx;
                finalResult[blockIndex].blockMiningReward = txDetail.blockMiningReward;
                finalResult[blockIndex].blockFeesPerTx = txDetail.blockFeesPerTx;
                finalResult[blockIndex].blockTotalVoutPerTx = txDetail.blockTotalVoutPerTx;
                finalResult[blockIndex].blockHighestVout = txDetail.blockHighestVout;
            }
            result = result.concat(finalResult);
        }

        return result;
    }
    
    static async getBlockBasicInfoByDateRange(intervalInMinutes: number): Promise<undefined | BlockBasicInfoWithTx[]> {
        var result: BlockBasicInfoWithTx[] = [];
        const dateGenerator = ChartDataProvider.getDateRangeGenerator(intervalInMinutes);
        if(dateGenerator === undefined) { return undefined; }
        
        var dateGenerated = dateGenerator.next();
        while(!dateGenerated.done) {
            const dateKey = dateGenerated.value.start + '_' + dateGenerated.value.end;
            const cacheKey = CacheKeys.ChartRawDataLongPrefix.key + dateKey;
            const ttl = CacheKeys.ChartRawDataLongPrefix.ttl;

            var queryResult = await PayloadCache.get<BlockBasicInfo[]>({
                source: async () => await ChartService.getDatasetFromDateRange(
                    dateGenerated.value.start,
                    // Add 1 second to avoid overlap
                    dateGenerated.value.end + 1
                ),
                abortSaveOn: (r) => r === undefined,
                key: cacheKey,
                ttl: ttl
            });
            
            if(queryResult !== undefined) {
                var finalResult: BlockBasicInfoWithTx[] = [];
                for(var blockIndex = 0; blockIndex < queryResult.length; blockIndex++) {
                    const txDetail = await ChartDataProvider.getBlockTxsBasicInfo(queryResult[blockIndex].txs);
                    finalResult[blockIndex] = queryResult[blockIndex] as BlockBasicInfoWithTx;
                    finalResult[blockIndex].blockMiningDataTx = txDetail.blockMiningDataTx;
                    finalResult[blockIndex].blockMiningReward = txDetail.blockMiningReward;
                    finalResult[blockIndex].blockFeesPerTx = txDetail.blockFeesPerTx;
                    finalResult[blockIndex].blockTotalVoutPerTx = txDetail.blockTotalVoutPerTx;
                }
                result = result.concat(finalResult);
            }
            dateGenerated = dateGenerator.next();
        }
        return result;
    }

    private static async getBlockTxsBasicInfo(blockTxs: string[]): Promise<ChartBlockTxsBasicInfo>{
        var blockFeesPerTx: number[] = [];
        var blockTotalVoutPerTx: number[] = [];
        var resultTxIndex: number = 0;
        var blockMiningDataTx: string = "";
        var blockMiningReward: number = 0;
        var blockHighestVout: number = 0;

        for(var txIndex = 0; txIndex < blockTxs.length; txIndex++) {
            const tx = blockTxs[txIndex];
            const cacheKey = CacheKeys.TxBasicInfoPrefix.key + tx;
            const ttl = CacheKeys.TxBasicInfoPrefix.ttl;

            const r = await PayloadCache.get<TxBasicInfo>({
                source: async () => TransactionService.getBasicInfo(tx),
                abortSaveOn: (r) => r === undefined,
                key: cacheKey,
                ttl: ttl
            });

            if(r !== undefined) {
                if(r.isMinedBlockTx) {
                    blockMiningDataTx = tx;
                    blockMiningReward = r.miningReward;
                }

                if(r.totalVout > blockHighestVout) {
                    blockHighestVout = r.totalVout;
                }
                blockFeesPerTx[resultTxIndex] = r.txFee;
                blockTotalVoutPerTx[resultTxIndex] = r.totalVout;
                resultTxIndex += 1;
            }
        }

        return {
            blockMiningDataTx: blockMiningDataTx,
            blockMiningReward: blockMiningReward,
            blockTotalVoutPerTx: blockTotalVoutPerTx,
            blockFeesPerTx: blockFeesPerTx,
            blockHighestVout: blockHighestVout,
        };
    }

    private static getDateRangeGenerator(intervalInMinutes: number): undefined | Generator<DateRange> {
        const highDate = new Date();

        const lowDate = structuredClone(highDate);
        lowDate.setMinutes(lowDate.getMinutes() - intervalInMinutes);
        
        return ChartService.dataRange(
            highDate,
            lowDate,
            ChartDataProvider.stepsInMinutes
        );
    }
}