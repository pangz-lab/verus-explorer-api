import { CacheKeys } from "../caching/CacheKeys";
import { PayloadCache } from "../caching/Caching";
import { BlockchainService } from "../chain/BlockchainService";
import { BlockBasicInfo } from "../chain/BlockService";
import { ChartService, DateRange } from "./ChartService";

export class ChartDataProvider {
    private static stepsInMinutes = 5;

    static async getBlockBasicInfoWithinRange(range: string, count: number): Promise<undefined | BlockBasicInfo[]> {
        const rawHeightPayload = await BlockchainService.getHeight();
        if(rawHeightPayload == undefined || rawHeightPayload.error) {
            return undefined;
        }
        const height = parseInt(rawHeightPayload.data.toString());
        const cacheKey = CacheKeys.ChartRawDataShortPrefix.key + range;
        const ttl = CacheKeys.ChartRawDataShortPrefix.ttl;
        
        const result = await PayloadCache.get<BlockBasicInfo[]>({
            source: async () => await ChartService.getDatasetFromHeight(height, count),
            abortSaveOn: (r) => r === undefined,
            key: cacheKey,
            ttl: ttl
        });

        return result;
    }
    
    static async getBlockBasicInfoByDateRange(intervalInMinutes: number): Promise<undefined | BlockBasicInfo[]> {
        var result: BlockBasicInfo[] = [];
        const dateGenerator = ChartDataProvider.getDateRangeGenerator(intervalInMinutes);
        if(dateGenerator === undefined) { return undefined; }
        
        var dateGenerated = dateGenerator.next();
        while(!dateGenerated.done) {
            const dateKey = dateGenerated.value.start + '_' + dateGenerated.value.end;
            const cacheKey = CacheKeys.ChartRawDataLongPrefix.key + dateKey;
            const ttl = CacheKeys.ChartRawDataLongPrefix.ttl;

            const r = await PayloadCache.get<BlockBasicInfo[]>({
                source: async () => await ChartService.getDatasetFromDateRange(
                    dateGenerated.value.start,
                    // Add 1 second to avoid overlap
                    dateGenerated.value.end + 1
                ),
                abortSaveOn: (r) => r === undefined,
                key: cacheKey,
                ttl: ttl
            });

            if(r !== undefined) { result = result.concat(r); }
            dateGenerated = dateGenerator.next();
        }
        return result;
    }

    private static getDateRangeGenerator(intervalInMinutes: number): Generator<DateRange> | undefined {
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