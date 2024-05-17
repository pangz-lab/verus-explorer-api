import { CacheKeys } from "../../services/caching/CacheKeys";
import { PayloadCache } from "../../services/caching/Caching";
import { BlockchainService } from "../../services/chain/BlockchainService";
import { ChartService, DateRange } from "../../services/chart/ChartService";
import { BlockBasicInfo, BlockBasicInfoWithTx } from "../../models/BlockBasicInfo";
import { TransactionService, TxBasicInfo } from "../../services/chain/TransactionService";

type TempBasicTxInfo = {
    minedDataTx: string,
    minedValue: number,
    txsFee: number[]
};

export class ChartDataProvider {
    private static stepsInMinutes = 10;

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
                
                const txDetail = await ChartDataProvider.getBasicTxInfo(queryResult[blockIndex].txs);
                finalResult[blockIndex] = queryResult[blockIndex] as BlockBasicInfoWithTx;
                finalResult[blockIndex].minedDataTx = txDetail.minedDataTx;
                finalResult[blockIndex].minedValue = txDetail.minedValue;
                finalResult[blockIndex].txsFee = txDetail.txsFee;
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
                    const txDetail = await ChartDataProvider.getBasicTxInfo(queryResult[blockIndex].txs);
                    finalResult[blockIndex] = queryResult[blockIndex] as BlockBasicInfoWithTx;
                    finalResult[blockIndex].minedDataTx = txDetail.minedDataTx;
                    finalResult[blockIndex].minedValue = txDetail.minedValue;
                    finalResult[blockIndex].txsFee = txDetail.txsFee;
                }
                result = result.concat(finalResult);
            }
            dateGenerated = dateGenerator.next();
        }
        return result;
    }

    private static async getBasicTxInfo(blockTxs: string[]): Promise<TempBasicTxInfo>{
        var txsFee: number[] = [];
        var txsFeeIndex: number = 0;
        var minedDataTx: string = "";
        var minedValue: number = 0;

        for(var txIndex = 0; txIndex < blockTxs.length; txIndex++) {
            const tx = blockTxs[txIndex];
            const cacheKey = CacheKeys.TxInfoPrefix.key + tx;
            const ttl = CacheKeys.TxInfoPrefix.ttl;

            const r = await PayloadCache.get<TxBasicInfo>({
                source: async () => TransactionService.getBasicInfo(tx),
                abortSaveOn: (r) => r === undefined,
                key: cacheKey,
                ttl: ttl
            });

            if(r !== undefined) {
                if(r.isMinedBlockTx) {
                    minedDataTx = tx;
                    minedValue = r.miningReward;
                }
                txsFee[txsFeeIndex] = r.txFee;
                txsFeeIndex += 1;
            }
        }

        return {
            minedDataTx: minedDataTx,
            minedValue: minedValue,
            txsFee: txsFee,
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