import { BlockBasicInfoWithTx } from "../../../models/BlockBasicInfo";
import { ChartService } from "../../../services/chart/ChartService";
import { ChartData, ChartDataService, ChartDataInterace, ChartDataOptions } from "../ChartDataInterface";

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
        blockMiningReward: number,
        totalBlockVoutValue: number,
    }
};

export class ChainBasicInfoChartData 
    extends ChartDataService
    implements ChartDataInterace {
    private blockInfo: BlockBasicInfoWithTx[];
    private processResult: ProcessResult = {};
    private options: ChartDataOptions;
    private maxVoutValue = 0;

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
                    blockMiningReward: 0,
                    totalBlockVoutValue: 0,
                }
            }
            result[dateIndex].blockCount = result[dateIndex].blockCount + 1;
            result[dateIndex].txCount = result[dateIndex].txCount + data[i].txs.length;
            result[dateIndex].difficulty = result[dateIndex].difficulty + data[i].difficulty;
            result[dateIndex].blockMiningReward = result[dateIndex].blockMiningReward + data[i].blockMiningReward;
            result[dateIndex].totalBlockVoutValue = result[dateIndex].totalBlockVoutValue + ChartService.getSum(data[i].blockTotalVoutPerTx);
            if(result[dateIndex].totalBlockVoutValue > this.maxVoutValue) {
                this.maxVoutValue = result[dateIndex].totalBlockVoutValue;
            }
        }
        this.processResult = result;
        return this;
    }

    format(): ChartData {
        var labels = [];
        var blockCount = [];
        var txCount = [];
        var difficulty = [];
        var miningReward = [];
        var totalBlockVoutValue = [];
        var resultIndex = Object.keys(this.processResult).length - 1;

        const voutConversionUnit = ChartService.getConversionUnit(this.maxVoutValue);
        
        for (const key in this.processResult) {
            labels[resultIndex] = this.processResult[key].displayText;
            blockCount[resultIndex] = this.processResult[key].blockCount;
            txCount[resultIndex] = this.processResult[key].txCount;
            difficulty[resultIndex] = parseFloat((this.processResult[key].difficulty / 1e12).toFixed(4));
            miningReward[resultIndex] = parseFloat(this.processResult[key].blockMiningReward.toFixed(4));
            totalBlockVoutValue[resultIndex] = parseFloat((this.processResult[key].totalBlockVoutValue/ (voutConversionUnit?.value ?? 1)).toFixed(4));
            resultIndex -= 1;
        }

        return {
            labels: labels,
            data: {
                'blockCount': { data: blockCount, options: {}},
                'txCount': { data: txCount, options: {}},
                'difficulty': { data: difficulty, options: {}},
                'miningReward': { data: miningReward, options: {}},
                'totalBlockVoutValue': { data: totalBlockVoutValue, options: { conv: voutConversionUnit}}
            },
        }
    }

    private getDateIndex(date: Date, dataIntervalInMinutes: number): LabelData {
        var minutes = "00";
        const rawMinuteValue = date.getMinutes();
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');

        // More than a day
        if(dataIntervalInMinutes >= 60 * 6) {
            return {
                label: year + '/' + month + '/' + day,
                key: year + '-' + month + '-' + day,
            };
        }
        
        // More than an hour
        if(dataIntervalInMinutes >= 60) {
            return {
                label: year + '/' + month + '/' + day + ' ' + hour + ':00',
                key: year + '-' + month + '-' + day + '_' + hour + ':00',
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
            label: year + '/' + month + '/' + day + ' ' + hour + ':' + minutes,
            key: year + '-' + month + '-' + day + '_' + hour + ':' + minutes,
        };
    }
}