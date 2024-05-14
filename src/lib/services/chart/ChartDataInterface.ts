export type ChartDataOptions = {
    dataIntervalInMinutes?: number,
}

export interface ChartDataInterace {
    process(): ChartDataInterace;
    format(): ChartData;
}

export class ChartDataService {
    protected getDefaultOptions(): ChartDataOptions {
        return {
            dataIntervalInMinutes: 5
        }
    }

    protected getOption<T>(value: T | undefined, defaultValue: T): T {
        return value ?? defaultValue;
    }
}

export type ChartData = {
    labels: string[],
    data: Array<number[] | string[]>,
};