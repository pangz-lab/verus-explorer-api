import { ChartData, ChartDataInterace, ChartDataOptions } from "./ChartDataInterface";
import { BlockBasicInfo } from "../chain/BlockService";
import { ChartDataProvider } from "./ChartDataProvider";
import { BlockBasicInfoChartData } from "./types/BlockBasicInfoChartData";
import { TransactionOverTimeChartData } from "./types/TransactionOverTimeChartData";
import { CacheKeys } from "../caching/CacheKeys";
import { PayloadCache } from "../caching/Caching";

type ChartDataServiceClass = {
    [key in ChartType]: { className: new (data: any, options: ChartDataOptions) => ChartDataInterace; };
};

type ChartTimeRange = {
    [key: string]: {
        minutes: number,
        cacheTtl: number,
        xIntervalInMinutes: number
    }
};

type ChartNumberRange = {
    [key: string]: {
        value: number,
        cacheTtl: number,
    }
};

type OperationData = BlockBasicInfo[] | undefined;

export type ChartType = "txovertime" | "blkbasicinfo";

export class ChartDataFactory {

    static readonly classMap: ChartDataServiceClass = {
        "txovertime": { className: TransactionOverTimeChartData },
        "blkbasicinfo": { className: BlockBasicInfoChartData },
    };

    static readonly allowedTimeRange: ChartTimeRange = {
        "last10Minutes" : { minutes: 10, cacheTtl: 60 * 5, xIntervalInMinutes: 5 },
        "last30Minutes" : { minutes: 30, cacheTtl: 60 * 5, xIntervalInMinutes: 5 },
        "lastHour" : { minutes: 60, cacheTtl: 60 * 10, xIntervalInMinutes: 10 },
        "last3Hours" : { minutes: 60 * 3, cacheTtl: 60 * 15, xIntervalInMinutes: 10 },
        "last6Hours" : { minutes: 60 * 6, cacheTtl: 60 * 15, xIntervalInMinutes: 10 },
        "last12Hours" : { minutes: 60 * 12, cacheTtl: 60 * 15, xIntervalInMinutes: 20 },
        "last24Hours" : { minutes: 60 * 24, cacheTtl: 60 * 15, xIntervalInMinutes: 30 },
        "last3Days" : { minutes: 60 * 24 * 3, cacheTtl: 60 * 15, xIntervalInMinutes: 60 * 3 },
        "last7Days" : { minutes: 60 * 24 * 7, cacheTtl: 60 * 30, xIntervalInMinutes: 60 * 3 },
        "last15Days" : { minutes: 60 * 24 * 15, cacheTtl: 60 * 60, xIntervalInMinutes: 60 * 6 },
        "last30Days" : { minutes: 60 * 24 * 30, cacheTtl: 60 * 60 * 12, xIntervalInMinutes: 60 * 24 * 15 },
        "last90Days" : { minutes: 60 * 24 * 30 * 3, cacheTtl: 60 * 60 * 12, xIntervalInMinutes: 60 * 24 * 30 },
    };
    
    static readonly allowedNumberRange: ChartNumberRange = {
        "last10" : { value: 10, cacheTtl: 60 * 5 },
        "last50" : { value: 50, cacheTtl: 60 * 5 },
        "last100" : { value: 100, cacheTtl: 60 * 10 },
        "last500" : { value: 500, cacheTtl: 60 * 10 },
    };

    static create<T>(chartType: ChartType, data: T, options: ChartDataOptions): ChartDataInterace {
        return new ChartDataFactory.classMap[chartType].className(data, options);
    }

    static async getOperation(type: ChartType, range: string): Promise<{ options: ChartDataOptions; dataSource: OperationData }> {
        switch(type) {
            case "txovertime": return {
                options: { dataIntervalInMinutes: ChartDataFactory.allowedTimeRange[range].xIntervalInMinutes },
                dataSource: await ChartDataProvider.getBlockBasicInfoByDateRange(ChartDataFactory.allowedTimeRange[range]!.minutes)
            };
            case "blkbasicinfo": return {
                options: {},
                dataSource: await ChartDataProvider.getBlockBasicInfoWithinRange(
                    range.toString(),
                    ChartDataFactory.allowedNumberRange[range].value
                )
            };
        }
    }

    static async createData<T>(
        type: ChartType,
        range: string,
        dataSource: T,
        options: ChartDataOptions): Promise<undefined | ChartData> {
        const cacheKey = CacheKeys.ChartDispDataPrefix.key + ':' + type + '_' + range;
        const ttl = ChartDataFactory.getCacheTtl(range);

        return await PayloadCache.get<ChartData>({
            source: () => ChartDataFactory
                .create<T>(type, dataSource, options)
                .process()
                .format(),
            abortSaveOn: (r) => r === undefined || r.labels[0] === undefined,
            key: cacheKey,
            ttl: ttl
        });
    }

    static isConfigValid(type: ChartType, range: string): boolean {
        return ChartDataFactory.isTypeAllowed(type) 
            && ChartDataFactory.isRangeAllowed(range);
    }

    private static getRangeSetting(range: string): ChartTimeRange | ChartNumberRange | undefined  {
        if(ChartDataFactory.allowedTimeRange[range] !== undefined) {
            return ChartDataFactory.allowedTimeRange;
        }
        
        if(ChartDataFactory.allowedNumberRange[range] !== undefined) {
            return ChartDataFactory.allowedNumberRange;
        }

        return undefined;
    }

    private static getCacheTtl(range: string): number {
        if(!ChartDataFactory.isRangeAllowed(range)) {
            throw new Error(`Unknown range '${range}'. Cache TTL not found`);
        }
        //TODO improve this
        return ChartDataFactory.getRangeSetting(range)![range].cacheTtl;
    }

    private static isRangeAllowed(range: string): boolean {
        return ChartDataFactory.getRangeSetting(range) !== undefined;
    }

    private static isTypeAllowed(type: ChartType): boolean {
        return ChartDataFactory.classMap[type] !== undefined;
    }
}