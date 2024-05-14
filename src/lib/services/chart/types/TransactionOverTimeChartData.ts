import { ChartData, ChartDataInterace, ChartDataOptions } from "../../../models/ChartDataInterface";
import { BlockBasicInfo } from "../../chain/BlockService";

type LabelData = {
    label: string,
    key: string,
}

type AggregateData = {
    [key: string]: {
        displayText: string,
        blockCount: number,
        txCount: number
    }
};

export class TransactionOverTimeChartData implements ChartDataInterace {
    private blockInfo: BlockBasicInfo[];
    private aggregateData: AggregateData = {};
    private options: ChartDataOptions;

    constructor(blockInfo: BlockBasicInfo[], options: ChartDataOptions) {
        this.blockInfo = blockInfo;
        this.options = options;
    }

    process(): ChartDataInterace {
        this.aggregateData = {};
        var dateIndex = "";
        const data = this.blockInfo;

        for(var i = 0; i < data.length; i++) {
            const d = new Date(data[i].time * 1000);
            const id = this.getDateIndex(d, this.options.dataIntervalInMinutes);
            dateIndex = id.key;
            if(this.aggregateData[dateIndex] == undefined) {
                this.aggregateData[dateIndex] = {
                    displayText: id.label,
                    blockCount: 0,
                    txCount: 0,
                }
            }
            this.aggregateData[dateIndex].blockCount = this.aggregateData[dateIndex].blockCount + 1;
            this.aggregateData[dateIndex].txCount = this.aggregateData[dateIndex].txCount + data[i].txs.length;
        }
        return this;
    }

    format(): ChartData {
        var labels = [];
        var blockCount = [];
        var txCount = [];
        for (const key in this.aggregateData) {
            labels.unshift(this.aggregateData[key].displayText);
            blockCount.unshift(this.aggregateData[key].blockCount);
            txCount.unshift(this.aggregateData[key].txCount);
        }

        return {
            labels: labels,
            data: [
                blockCount,
                txCount
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

        // Less than a minute
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