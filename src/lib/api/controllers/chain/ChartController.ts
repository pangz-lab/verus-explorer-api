import { Request, Response } from 'express';
import { Payload } from '../../../services/Payload';
import { Logger } from '../../../services/Logger';
import { ChartDataFactory, ChartDataGenStatus, ChartType } from '../../../provider/chart/ChartDataFactory';

export class ChartController {

    static async query(req: Request, res: Response) {
        try {
            //TODO: messy, improve the conditions
            const chartType = req.params.type as ChartType;
            const range = req.query.range as string;
            if(!ChartDataFactory.isConfigValid(chartType, range)) {
                return res.status(400).send("Invalid request!");
            }

            const generationStatus = await ChartDataFactory.getDataGenExecFlag(chartType, range);
            if(generationStatus === ChartDataGenStatus.active) {
                return res.status(208).send({ message: 'Data generation is ongoing' });
            } else {
                ChartController.activateDataGeneration(chartType, range);
            }

            // Cache data
            var chartData = await ChartDataFactory.createData<any>(chartType, range, [], {});
            
            if(chartData === undefined) {
                const operation = await ChartDataFactory.getOperation(chartType, range);
                if(operation.dataSource === undefined) {
                    ChartController.deactivateDataGeneration(chartType, range);
                    return res.status(404).send("Failed to retrieve raw data!");
                }

                chartData = await ChartDataFactory.createData<typeof operation.dataSource>(chartType, range, operation.dataSource, operation.options);
                if(chartData === undefined) {
                    ChartController.deactivateDataGeneration(chartType, range);
                    return res.status(404).send("Failed to retrieve chart data!");
                }
            }

            ChartController.deactivateDataGeneration(chartType, range);
            res.send(Payload.withSuccess(chartData));
        } catch(e) {
            Logger.toErrorLog('[HTTP Error]'+ (e as string)).write();
            return res.status(500).send("Internal server error!");
        }
    }

    private static deactivateDataGeneration(chartType: ChartType, range: string): void {
         ChartDataFactory.setDataGenExecFlag(chartType, range, ChartDataGenStatus.inactive);
    }
    
    private static activateDataGeneration(chartType: ChartType, range: string): void {
        ChartDataFactory.setDataGenExecFlag(chartType, range, ChartDataGenStatus.active);
    }
}