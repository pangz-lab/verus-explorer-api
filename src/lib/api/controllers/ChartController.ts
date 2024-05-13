import { Request, Response } from 'express';
import { PayloadCache } from '../../services/caching/Caching';
import { CacheKeys } from '../../services/caching/CacheKeys';
import { Payload } from '../../services/Payload';
import { ChartService, DateRange } from '../../services/chart/ChartService';
import { Logger } from '../../services/Logger';
import { BlockBasicInfo } from '../../services/chain/BlockService';
import { ChartDataFactory } from '../../services/chart/ChartDataFactory';
import { ChartData } from '../../models/ChartDataInterface';

export class ChartController {
    private static cacheDataIntervalInMinutes = 5;

    static async query(req: Request, res: Response) {
        try {
            const chartType = req.params.type as string;
            const range = req.query.range as string;
            if(!Object.keys(ChartDataFactory.allowedRange).includes(range) 
                || ChartDataFactory.classMap[chartType] === undefined) {
                return res.status(400).send("Invalid request!");
            }

            var chartData = await ChartController.getChartData<BlockBasicInfo[]>(chartType, range, []);
            if(chartData === undefined) {
                const dataSource = await ChartController.getDataSource(range);
                if(dataSource === undefined) {
                    return res.status(404).send("Failed to retrieve raw data!");
                }

                chartData = await ChartController.getChartData<BlockBasicInfo[]>(chartType, range, dataSource);
                if(chartData === undefined) {
                    return res.status(404).send("Failed to retrieve chart data!");
                }
            }
            
            res.send(Payload.withSuccess(chartData));
        } catch(e) {
            Logger.toErrorLog('[HTTP Error]'+ (e as string)).write();
            return res.status(500).send("Internal server error!");
        }
    }

    private static async getChartData<T>(chartType: string, range: string, dataSource: T): Promise<undefined | ChartData> {
        const cacheKey = CacheKeys.ChartDispDataPrefix.key + ':' + range + '_' + chartType;
        const ttl = ChartDataFactory.allowedRange[range].cacheTtl;
        const dataIntervalInMinutes = ChartDataFactory.allowedRange[range].dataIntervalInMinutes;
        return await PayloadCache.get<ChartData>({
            source: () => ChartDataFactory
                .create<T>(chartType, dataSource, {
                    dataIntervalInMinutes: dataIntervalInMinutes
                })
                .process()
                .format(),
            abortSaveOn: (r) => r === undefined || r.labels[0] === undefined,
            key: cacheKey,
            ttl: ttl
        });
    }

    private static async getDataSource(range: string): Promise<undefined | BlockBasicInfo[]> {
        var result: BlockBasicInfo[] = [];
        const dateGenerator = ChartController.getDateRangeGenerator(range);
        if(dateGenerator === undefined) { return undefined; }
        
        var dateGenerated = dateGenerator.next();
        while(!dateGenerated.done) {
            const dateKey = dateGenerated.value.start + '_' + dateGenerated.value.end;
            const cacheKey = CacheKeys.ChartQueryPrefix.key + dateKey;
            const ttl = CacheKeys.ChartQueryPrefix.ttl;

            const r = await PayloadCache.get<BlockBasicInfo[]>({
                source: async () => await ChartService.getDatasetFromRange(
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

    private static getDateRangeGenerator(selectedRange: string): Generator<DateRange> | undefined {
        if(!Object.keys(ChartDataFactory.allowedRange).includes(selectedRange)) { return undefined; }
        const highDate = new Date();
        const minutes = ChartDataFactory.allowedRange[selectedRange]!.minutes;

        const lowDate = structuredClone(highDate);
        lowDate.setMinutes(lowDate.getMinutes() - minutes);
        
        return ChartService.dataRange(
            highDate,
            lowDate,
            ChartController.cacheDataIntervalInMinutes
        );
    }
}