import { BlockBasicInfo } from "../../models/BlockBasicInfo";
import { Payload } from "../Payload";
import { BlockService } from "../chain/BlockService";

// export type DateRange = {
//     start: number,
//     end: number,
// }

export type ConversionUnit = {
    value: number,
    unit: string,
}

export class ChartService {
    private static conversionUnit = new Map<string, ConversionUnit>([
        ['1e18', { value: 1e18, unit: '1E' }],
        ['1e15', { value: 1e15, unit: '1P' }],
        ['1e12', { value: 1e12, unit: '1T' }],
        ['1e9', { value: 1e9, unit: '1B' }],
        ['1e6', { value: 1e6, unit: '1M' }],
        ['1e3', { value: 1e3, unit: '1k' }],
        ['1', { value: 1, unit: '' }],
    ]);
    static async getDatasetFromHeight(startHeight: number, count: number): Promise<undefined | BlockBasicInfo[]> {
        const rangeLabel = startHeight.toString() + '_' + count.toString();
        try {
            const lastHeight = startHeight - count;
            var data: BlockBasicInfo[] = [];

            for(var height = startHeight; height >= lastHeight; height--) {
                const result = await BlockService.getSummary(height);
                if(result !== undefined) { data.push(result);  }
            }

            return data;
        } catch(e) {
            Payload.logError(
                'getting chart data from range - [Exception] : ' + e,
                `Range: ${rangeLabel}`,
                `getDatasetFromHeight`);
            return undefined;
        }
    }
    
    static async getDatasetFromDateRange(startTime: number, endTime: number): Promise<undefined | BlockBasicInfo[]> {
        const rangeLabel = startTime.toString() + '_' + endTime.toString();
        try {
            const result = await BlockService.getHashesByRange(startTime, endTime);
            if(result?.error || result?.data == undefined) { return undefined; }

            var data: BlockBasicInfo[] = [];
            const blockHashes = result!.data as string[];
            for(var i = 0; i < blockHashes.length; i++) {
                const r = await BlockService.getSummary(blockHashes.at(i) as string);
                if(r !== undefined) { data.push(r); }
            }
            return data;

        } catch(e) {
            Payload.logError(
                'getting chart data from range - [Exception] : ' + e,
                `Range: ${rangeLabel}`,
                `getDatasetFromDateRange`);
            return undefined;
        }
    }

    // static* createRangeInDate(highDate: Date, lowDate: Date, stepsInMinutes = 10): Generator<DateRange> {
    //     if(highDate.getTime() < lowDate.getTime()) {
    //         throw new Error("highDate should be lower than the lowDate");
    //     }

    //     if(stepsInMinutes < 0) {
    //         throw new Error("stepsInMinutes should be greater than or equal to zero(0)");
    //     }

    //     lowDate = ChartService.setDateMinutes(lowDate, stepsInMinutes);
    //     var runningStartDate = structuredClone(lowDate);
    //     var runningEndDate = structuredClone(lowDate);

    //     while(runningEndDate.getTime() < highDate.getTime()) {
    //         runningStartDate.setMinutes(runningStartDate.getMinutes() + stepsInMinutes, 0, 0);
    //         runningEndDate.setMinutes(runningEndDate.getMinutes(), 0, 0);
    //         yield {
    //             start: parseInt(runningStartDate.getTime().toString().slice(0, 10)),
    //             end: parseInt(runningEndDate.getTime().toString().slice(0, 10)),
    //         }
    //         runningEndDate = structuredClone(runningStartDate);
    //     }
    // }

    // private static setDateMinutes(lowDate: Date, stepsInMinutes: number) {
    //     const lowDateMinute = lowDate.getMinutes();
    //     if(lowDateMinute == 0) {
    //         return lowDate;
    //     }

    //     if(lowDateMinute < stepsInMinutes) {
    //         lowDate.setMinutes(0);
    //     }

    //     if(lowDateMinute > stepsInMinutes && lowDateMinute % stepsInMinutes > 0) {
    //         lowDate.setMinutes(lowDateMinute - (lowDateMinute % stepsInMinutes));
    //     }

    //     return lowDate;
    // }

    static getSum(data: number[]): number {
        var result = 0;
        for(var i = 0; i < data.length; i++) {
          result += data[i];
        }
        return parseFloat(result.toFixed(4));
    }

    static getConversionUnit(maxValue: number): undefined | ConversionUnit {
        for( var [k, cu] of ChartService.conversionUnit.entries()) {
            if(maxValue > cu.value) {
                return cu;
            }
        }
        return ChartService.conversionUnit.get('1');
    }
}