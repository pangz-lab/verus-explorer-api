import { Request, Response } from 'express';
import { Payload } from '../../services/Payload';
import { Logger } from '../../services/Logger';
import { ChartDataFactory, ChartType } from '../../services/chart/ChartDataFactory';

export class ChartController {

    static async query(req: Request, res: Response) {
        try {
            const chartType = req.params.type as ChartType;
            const range = req.query.range as string;
            if(!ChartDataFactory.isConfigValid(chartType, range)) {
                return res.status(400).send("Invalid request!");
            }

            var chartData = await ChartDataFactory.createData<any>(chartType, range, [], {});
            
            if(chartData === undefined) {
                const operation = await ChartDataFactory.getOperation(chartType, range);
                if(operation.dataSource === undefined) {
                    return res.status(404).send("Failed to retrieve raw data!");
                }

                chartData = await ChartDataFactory.createData<typeof operation.dataSource>(chartType, range, operation.dataSource, operation.options);
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
}