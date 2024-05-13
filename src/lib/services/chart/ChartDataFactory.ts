import { ChartDataInterace, ChartDataOptions } from "../../models/ChartDataInterface";
import { TransactionOverTimeChartData } from "./types/TransactionOverTimeChartData";

type ChartDataClassStructure = {
    [key: string]: { className: new(data: any, options: ChartDataOptions) => ChartDataInterace }
}

type ChartBasicDef = {
    [key: string]: {
        minutes: number,
        cacheTtl: number,
        dataIntervalInMinutes: number
    }
};

export class ChartDataFactory {
    static readonly classMap: ChartDataClassStructure = {
        "txovertime": { className: TransactionOverTimeChartData },
    };

    static readonly allowedRange: ChartBasicDef = {
        "last10Minutes" : { minutes: 10, cacheTtl: 60 * 5, dataIntervalInMinutes: 10 },
        "last30Minutes" : { minutes: 30, cacheTtl: 60 * 5, dataIntervalInMinutes: 10 },
        "lastHour" : { minutes: 60, cacheTtl: 60 * 10, dataIntervalInMinutes: 10 },
        "last3Hours" : { minutes: 60 * 3, cacheTtl: 60 * 15, dataIntervalInMinutes: 10 },
        "last6Hours" : { minutes: 60 * 6, cacheTtl: 60 * 15, dataIntervalInMinutes: 10 },
        "last12Hours" : { minutes: 60 * 12, cacheTtl: 60 * 15, dataIntervalInMinutes: 20 },
        "last24Hours" : { minutes: 60 * 24, cacheTtl: 60 * 15, dataIntervalInMinutes: 30 },
        "last3Days" : { minutes: 60 * 24 * 3, cacheTtl: 60 * 15, dataIntervalInMinutes: 60 * 3 },
        "last7Days" : { minutes: 60 * 24 * 7, cacheTtl: 60 * 30, dataIntervalInMinutes: 60 * 3 },
        "last15Days" : { minutes: 60 * 24 * 15, cacheTtl: 60 * 60, dataIntervalInMinutes: 60 * 6 },
        "last30Days" : { minutes: 60 * 24 * 30, cacheTtl: 60 * 60 * 12, dataIntervalInMinutes: 60 * 24 * 15 },
        "last90Days" : { minutes: 60 * 24 * 30 * 3, cacheTtl: 60 * 60 * 12, dataIntervalInMinutes: 60 * 24 * 30 },
    };

    static create<T>(chartType: string, data: T, options: ChartDataOptions): ChartDataInterace {
        return new ChartDataFactory.classMap[chartType].className(data, options);
    }
}