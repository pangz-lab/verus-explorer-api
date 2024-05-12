import { Request, Response } from 'express';
import { PayloadCache } from '../../services/caching/Caching';
import { CacheKeys } from '../../services/caching/CacheKeys';
import { Payload } from '../../services/Payload';
import { ChartService, DateRange } from '../../services/chart/ChartService';
import { Logger } from '../../services/Logger';
import { BlockBasicInfo } from '../../services/chain/BlockService';

export class ChartController {
    private static cacheDataIntervalInMinutes = 5;
    private static allowedRange = [
        "last10Minutes",
        "last30Minutes",
        "lastHour",
        "last3Hours",
        "last6Hours",
        "last12Hours",
        "last24Hours",
        "last3Days",
        "last7Days",
        "last15Days",
        "last30Days",
        "last90Days",
    ];

    static async query(req: Request, res: Response) {
        try {
            const range = req.query.range as string;
            if(!ChartController.allowedRange.includes(range)) {
                return res.status(400).send("Invalid request!");
            }
            
            const dateGenerator = ChartController.getDateRangeGenerator(range);
            if(dateGenerator === undefined) { return res.status(404).send("Invalid data range!"); }
            
            var resBody: BlockBasicInfo[] = [];
            var dateGenerated = dateGenerator.next();
            while(!dateGenerated.done) {
                const dateKey = dateGenerated.value.start + '_' + dateGenerated.value.end;
                const cacheKey = CacheKeys.ChartQueryPrefix.key + dateKey;
                const ttl = CacheKeys.ChartQueryPrefix.ttl;

                const r = await PayloadCache.get<undefined | BlockBasicInfo[]>({
                    source: async () => await ChartService.getDatasetFromRange(
                        dateGenerated.value.start,
                        // Add 1 second to avoid overlap
                        dateGenerated.value.end + 1
                    ),
                    onAbortSave: (r) => r === undefined,
                    key: cacheKey,
                    ttl: ttl
                });

                if(r !== undefined) { resBody = resBody.concat(r); }
                dateGenerated = dateGenerator.next();
            }


            if(resBody === undefined) { return res.status(404).send("Failed to retrieve the data!"); }
            res.send(Payload.withSuccess(resBody));
        } catch(e) {
            Logger.toErrorLog('[HTTP Error]'+ (e as string)).write();
            return res.status(500).send("Internal server error!");
        }
    }

    private static getDateRangeGenerator(selectedRange: string): Generator<DateRange> | undefined {
        if(!ChartController.allowedRange.includes(selectedRange)) { return undefined; }
        const highDate = new Date();
        var minutes = 0;

        switch(selectedRange) {
            case "last10Minutes": minutes = 10; break;
            case "last30Minutes": minutes = 30; break;
            case "lastHour": minutes = 60; break;
            case "last3Hours": minutes = 60 * 3; break;
            case "last6Hours": minutes = 60 * 6; break;
            case "last12Hours": minutes = 60 * 12; break;
            case "last24Hours": minutes = 60 * 24; break;
            case "last3Days": minutes = 60 * 24 * 3; break;
            case "last7Days": minutes = 60 * 24 * 7; break;
            case "last15Days": minutes = 60 * 24 * 15; break;
            case "last30Days": minutes = 60 * 24 * 30; break;
            case "last90Days": minutes = 60 * 24 * 30 * 3; break;
        }

        const lowDate = structuredClone(highDate);
        lowDate.setMinutes(lowDate.getMinutes() - minutes);
        
        return ChartService.dataRange(
            highDate,
            lowDate,
            ChartController.cacheDataIntervalInMinutes
        );
    }
}