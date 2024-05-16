import { BlockBasicInfoWithTx } from "../../../models/BlockBasicInfo";
import { ChartData, ChartDataService, ChartDataInterace, ChartDataOptions } from "../../../services/chart/ChartDataInterface";

type LabelData = {
    label: string,
    key: string,
}

type ProcessResult = {
    [key: string]: {
        displayText: string,
        blockCount: number,
        txCount: number,
        difficulty: number,
        minedValue: number,
    }
};

export class TransactionOverTimeChartData 
    extends ChartDataService
    implements ChartDataInterace {
    private blockInfo: BlockBasicInfoWithTx[];
    private processResult: ProcessResult = {};
    private options: ChartDataOptions;

    constructor(blockInfo: BlockBasicInfoWithTx[], options: ChartDataOptions) {
        super();
        this.blockInfo = blockInfo;
        this.options = options;
    }

    process(): ChartDataInterace {
        var result: ProcessResult = {};
        var dateIndex = "";
        const data = this.blockInfo;
        const defaultOptions = this.getDefaultOptions();

        for(var i = 0; i < data.length; i++) {
            const d = new Date(data[i].time * 1000);
            const id = this.getDateIndex(d,
                this.getOption<number>(
                    this.options.dataIntervalInMinutes,
                    defaultOptions.dataIntervalInMinutes!
                )
            );
            dateIndex = id.key;
            if(result[dateIndex] === undefined) {
                result[dateIndex] = {
                    displayText: id.label,
                    blockCount: 0,
                    txCount: 0,
                    difficulty: 0,
                    minedValue: 0,
                }
            }
            result[dateIndex].blockCount = result[dateIndex].blockCount + 1;
            result[dateIndex].txCount = result[dateIndex].txCount + data[i].txs.length;
            result[dateIndex].difficulty = result[dateIndex].difficulty + data[i].difficulty;
            result[dateIndex].minedValue = result[dateIndex].minedValue + (data[i].minedValue ?? 0);
        }
        this.processResult = result;
        return this;
    }

    format(): ChartData {
        var labels = [];
        var blockCount = [];
        var txCount = [];
        var difficulty = [];
        var minedValue = [];
        var resultIndex = Object.keys(this.processResult).length - 1;
        
        for (const key in this.processResult) {
            labels[resultIndex] = this.processResult[key].displayText;
            blockCount[resultIndex] = this.processResult[key].blockCount;
            txCount[resultIndex] = this.processResult[key].txCount;
            difficulty[resultIndex] = this.processResult[key].difficulty / 1e10;
            minedValue[resultIndex] = this.processResult[key].minedValue;
            resultIndex -= 1;
        }

        return {
            labels: labels,
            data: [
                blockCount,
                txCount,
                difficulty,
                minedValue
            ],
        }
    }

    private getDateIndex(date: Date, dataIntervalInMinutes: number): LabelData {
        var minutes = "00";
        const rawMinuteValue = date.getMinutes();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');

        // More than a day
        if(dataIntervalInMinutes >= 60 * 6) {
            return {
                label: month + '/' + day,
                key: month + '-' + day,
            };
        }
        
        // More than an hour
        if(dataIntervalInMinutes >= 60) {
            return {
                label: month + '/' + day + ' ' + hour + ':00',
                key: month + '-' + day + '_' + hour + ':00',
            };
        }
        
        // Less than an hour
        if(rawMinuteValue < dataIntervalInMinutes) {
            minutes = "00";
        }

        if(rawMinuteValue >= dataIntervalInMinutes) {
            if((rawMinuteValue % dataIntervalInMinutes) > 0) {                        
                minutes = (
                    rawMinuteValue - 
                    (rawMinuteValue % dataIntervalInMinutes)
                ).toString().padStart(2, '0');
            } else {
                minutes = rawMinuteValue.toString().padStart(2, '0');
            }
        }
        return {
            label: month + '/' + day + ' ' + hour + ':' + minutes,
            key: month + '-' + day + '_' + hour + ':' + minutes,
        };
    }
}