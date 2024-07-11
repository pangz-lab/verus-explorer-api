export type DateRange = {
    start: number,
    end: number,
}

export type NumberRange = {
    start: number,
    end: number,
}

export class GeneratorService {
    static* createRangeInNum(endNum: number, steps = 100_000, startNum?: number): Generator<NumberRange> {
        const rangeStart = startNum ?? 0;
        if(endNum < rangeStart) { throw new Error("end number should be higher than the start number"); }
        if(steps <= 0) { throw new Error("steps should be greater than or equal to 1");}

        var runningStartNum = rangeStart;
        var runningEndNum = rangeStart;

        while(runningEndNum <= endNum) {
            runningStartNum = runningEndNum;
            runningEndNum = runningStartNum + steps;
            yield {
                start: runningStartNum,
                end: runningEndNum,
            }
        }
    }
    
    static* createRangeInDate(highDate: Date, lowDate: Date, stepsInMinutes = 10): Generator<DateRange> {
        if(highDate.getTime() < lowDate.getTime()) {
            throw new Error("highDate should be lower than the lowDate");
        }

        if(stepsInMinutes < 0) {
            throw new Error("stepsInMinutes should be greater than or equal to zero(0)");
        }

        lowDate = GeneratorService.setDateMinutes(lowDate, stepsInMinutes);
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