import { CacheKeys } from "../../services/caching/CacheKeys";
import { PayloadCache } from "../../services/caching/Caching";
import { BlockchainService } from "../../services/chain/BlockchainService";
import { TransactionService } from "../../services/chain/TransactionService";
import { ServicePayload } from "../../services/Payload";
import { ChartService, DateRange } from "../../services/chart/ChartService";
import { BlockBasicInfo, BlockBasicInfoWithTx } from "../../models/BlockBasicInfo";

type TxExtraData = {
    txFee: number,
    miningReward: number,
    isMinedBlockTx: boolean
};

type TxDetail = {
    txsDetail: Array<{[key: string]: any }>,
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
                const txDetail = await ChartDataProvider.getGetTxDetail(queryResult[blockIndex].txs);
                finalResult[blockIndex] = queryResult[blockIndex] as BlockBasicInfoWithTx;
                finalResult[blockIndex].minedDataTx = txDetail.minedDataTx;
                finalResult[blockIndex].minedValue = txDetail.minedValue;
                finalResult[blockIndex].txsDetail = txDetail.txsDetail;
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
                    const txDetail = await ChartDataProvider.getGetTxDetail(queryResult[blockIndex].txs);
                    finalResult[blockIndex] = queryResult[blockIndex] as BlockBasicInfoWithTx;
                    finalResult[blockIndex].minedDataTx = txDetail.minedDataTx;
                    finalResult[blockIndex].minedValue = txDetail.minedValue;
                    finalResult[blockIndex].txsDetail = txDetail.txsDetail;
                    finalResult[blockIndex].txsFee = txDetail.txsFee;
                }
                result = result.concat(finalResult);
            }
            dateGenerated = dateGenerator.next();
        }
        return result;
    }

    private static async getGetTxDetail(blockTxs: string[]): Promise<TxDetail>{
        var txsDetail: Array<{[key: string]: any }> = [];
        var txsFee: number[] = [];
        var txsFeeIndex: number = 0;
        var minedDataTx: string = "";
        var minedValue: number = 0;

        for(var txIndex = 0; txIndex < blockTxs.length; txIndex++) {
            const tx = blockTxs[txIndex];
            const cacheKey = CacheKeys.TxInfoPrefix.key + tx;
            const ttl = CacheKeys.TxInfoPrefix.ttl;

            const r = await PayloadCache.get<ServicePayload>({
                source: async () => TransactionService.getInfo(tx),
                abortSaveOn: (r) => r === undefined,
                key: cacheKey,
                ttl: ttl
            });

            if(!r?.error && r?.data !== undefined) {
                txsDetail[txIndex] = r.data;
                const txExtraData = ChartDataProvider.getTxExtraData(r.data as {[key: string]: any });
                if(txExtraData.isMinedBlockTx) {
                    minedDataTx = tx;
                    minedValue = txExtraData.miningReward;
                }
                txsFee[txsFeeIndex] = txExtraData.txFee;
                txsFeeIndex += 1;
            }
        }

        return {
            txsDetail: txsDetail,
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

    private static getTxExtraData(txDetail: any): TxExtraData {
        var txData = txDetail as {[key: string]: any };
        var txVinTotalValue: number = 0;
        var txVoutTotalValue: number = 0;
        var txVinFirstItem: number = txData?.vin[0];
        var txVoutFirstItem: number = txData?.vout[0];
        var txValueBalance: number = txData?.valueBalance;
        var miningReward = 0;
        var txFee = 0;
        const isMinedBlockTx = txDetail?.vin[0] != undefined
            && txDetail?.vin[0]["coinbase"] !== undefined
            && txDetail?.vout[0]["value"] !== undefined;
            miningReward = 0;

        var index = 0;
        while(txDetail?.vin[index] !== undefined) {
            txVinTotalValue += txDetail?.vin[index]["value"];
            index += 1;
        }

        index = 0;
        while(txDetail?.vout[index] !== undefined) {
            txVoutTotalValue += txDetail?.vout[index]["value"];
            index += 1;
        }

        if(isMinedBlockTx) {
            miningReward += txVoutTotalValue;
        } else {
            txFee = parseFloat((txVinTotalValue - txVoutTotalValue).toFixed(8));
            if (txValueBalance != undefined) {
                if (txVoutFirstItem == undefined) {
                    txFee = parseFloat((txValueBalance + txVinTotalValue).toFixed(8));
                } else if (txVinFirstItem == undefined) {
                    txFee = parseFloat((txValueBalance - txVoutTotalValue).toFixed(8));
                } else {
                    txFee = parseFloat(((txVinTotalValue - txVoutTotalValue) + txValueBalance).toFixed(8));
                }
            }
        }

        return {
            txFee: txFee,
            miningReward: miningReward,
            isMinedBlockTx: isMinedBlockTx
        };
    }
}