//Unused yet - double check
import { CacheKeys } from "../../services/caching/CacheKeys";
import { PayloadCache } from "../../services/caching/Caching";
import { AddressService } from "../../services/chain/AddressService";
import { GeneratorService } from "../../services/GeneratorService";
import { ServicePayload } from "../../services/Payload";

export class AddressDataProvider {
    static async getTxIdsByNumRange(address: string, endHeight: number): Promise<undefined | string[]> {
        var result: string[] = [];
        const numberGenerator = GeneratorService.createRangeInNum(endHeight);
        if(numberGenerator === undefined) { return undefined; }
        
        var rangeGenerated = numberGenerator.next();
        while(!rangeGenerated.done) {
            const numKey = rangeGenerated.value.start + '_' + rangeGenerated.value.end;
            const cacheKey = CacheKeys.AddressTxListPrefix.key  + address + ':' + numKey;
            const ttl = CacheKeys.AddressTxListPrefix.ttl;

            const start = rangeGenerated.value.start;
            var end = rangeGenerated.value.end - 1;
            // if(start === endHeight && start > end) { end = start; }

            const resBody: ServicePayload = await PayloadCache.get<ServicePayload>({
                source: async () => await AddressService.getTxIds(
                    address,
                    { start: start, end: end }
                ),
                abortSaveOn: (r) => r === undefined || (r != undefined && r.error),
                key: cacheKey,
                ttl: ttl
            });
            // const data: any = resBody?.data;
            if(resBody?.data !== undefined) {
                result.concat(resBody.data as string[]);
                // is not working for some reason
                // for(var i = 0; i <= (resBody?.data as string[]).length; i++) {
                //     result.push(resBody.data as string);
                // }
            }

            // var queryResult = await PayloadCache.get<ServicePayload>({
            //     source: async () => await ChartService.getDatasetFromDateRange(
            //         rangeGenerated.value.start,
            //         // Add 1 second to avoid overlap
            //         rangeGenerated.value.end + 1
            //     ),
            //     abortSaveOn: (r) => r === undefined,
            //     key: cacheKey,
            //     ttl: ttl
            // // });
            
            // if(queryResult !== undefined) {
            //     var finalResult: BlockBasicInfoWithTx[] = [];
            //     for(var blockIndex = 0; blockIndex < queryResult.length; blockIndex++) {
            //         const txDetail = await ChartDataProvider.getBlockTxsBasicInfo(queryResult[blockIndex].txs);
            //         finalResult[blockIndex] = queryResult[blockIndex] as BlockBasicInfoWithTx;
            //         finalResult[blockIndex].blockMiningDataTx = txDetail.blockMiningDataTx;
            //         finalResult[blockIndex].blockMiningReward = txDetail.blockMiningReward;
            //         finalResult[blockIndex].blockFeesPerTx = txDetail.blockFeesPerTx;
            //         finalResult[blockIndex].blockTotalVoutPerTx = txDetail.blockTotalVoutPerTx;
            //     }
            //     result = result.concat(finalResult);
            // }
            rangeGenerated = numberGenerator.next();
        }
        console.log(result);
        return result;
    }
}