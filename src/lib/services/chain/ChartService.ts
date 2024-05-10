import { Payload, ServicePayload } from "../Payload";
import { BlockService } from "./BlockService";

type DateRange = {
    start: number,
    end: number,
}

export class ChartService {
    
    static async getDatasetFromRange(startTime: number, endTime: number): Promise<ServicePayload> {
        const rangeLabel = startTime.toString() + '_' + endTime.toString();
        try {
            return BlockService.getHashesByRange(startTime, endTime);
        } catch(e) {
            Payload.logError(
                'getting chart data from range - [Exception] : ' + e,
                `Range: ${rangeLabel}`,
                `getDatasetFromRange`);
            return Payload.withError();
        }
    }

    static* dataRange(highDate: Date, lowDate: Date, stepsInMinutes = 10): Generator<DateRange> {
        if(highDate.getTime() < lowDate.getTime()) {
            throw new Error("highDate should be lower than the lowDate");
        }
        
        if(stepsInMinutes < 0) {
            throw new Error("stepsInMinutes should be greater than or equal to zero(0)");
        }

        lowDate = ChartService.setDateMinutes(lowDate, stepsInMinutes);
        var runningStartDate = structuredClone(lowDate);
        var runningEndDate = structuredClone(lowDate);

        while(runningEndDate.getTime() < highDate.getTime()) {
            runningStartDate.setMinutes(runningStartDate.getMinutes() + stepsInMinutes, 0, 0);
            runningEndDate.setMinutes(runningEndDate.getMinutes(), 0, 0);
            yield {
                start: parseInt(runningStartDate.getTime().toString().slice(0, 10)),
                end: parseInt(runningEndDate.getTime().toString().slice(0, 10)),
            }
            runningEndDate = structuredClone(runningStartDate);
        }
    }

    private static setDateMinutes(lowDate: Date, stepsInMinutes: number) {
        const lowDateMinute = lowDate.getMinutes();
        if(lowDateMinute == 0) {
            return lowDate;
        }

        if(lowDateMinute < stepsInMinutes) {
            lowDate.setMinutes(0);
        }

        if(lowDateMinute > stepsInMinutes && lowDateMinute % stepsInMinutes > 0) {
            lowDate.setMinutes(lowDateMinute - (lowDateMinute % stepsInMinutes));
        }

        return lowDate;
    }
}