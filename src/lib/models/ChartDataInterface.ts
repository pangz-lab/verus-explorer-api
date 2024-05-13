export type ChartDataOptions = {
    dataIntervalInMinutes: number,
}

export interface ChartDataInterace {
    process(): ChartDataInterace;
    format(): ChartData;
}

export type ChartData = {
    labels: string[],
    data: Array<number[]>,
};