import { ChartData, ChartDataService, ChartDataInterace, ChartDataOptions } from "../ChartDataInterface";
import { BlockBasicInfo } from "../../chain/BlockService";

// type LabelData = {
//     label: string,
//     key: string,
// }

// type AggregateData = {
//     [key: string]: {
//         displayText: string,
//         size: number,
//         diff: number,
//         txFee: number,
//     }
// };

export class BlockBasicInfoChartData 
    extends ChartDataService
    implements ChartDataInterace {
    private blockInfo: BlockBasicInfo[];
    // private aggregateData: AggregateData = {};
    private options: ChartDataOptions;

    constructor(blockInfo: BlockBasicInfo[], options: ChartDataOptions) {
        super();
        this.blockInfo = blockInfo;
        this.options = options;
    }

    process(): ChartDataInterace { return this; }

    format(): ChartData {
        var labels = [];
        var size = [];
        var diff = [];
        var txFee = [];
        var txCount = [];
        var blockType = [];

        for(var i = 0; i < this.blockInfo.length; i++) {
            const data = this.blockInfo[i];
            const dateIndex = data.height;
            labels.unshift(dateIndex.toString());
            size.unshift(data.size);
            diff.unshift(data.difficulty  / 1e9);
            // TODO get Tx fee
            txFee.unshift(0);
            txCount.unshift(data.txs.length);
            blockType.unshift(data.blocktype == 'mined'? 1 : 0);
        }

        // for (const key in this.aggregateData) {
        //     labels.unshift(this.aggregateData[key].displayText);
        //     size.unshift(this.aggregateData[key].size);
        //     diff.unshift(this.aggregateData[key].diff);
        //     txFee.unshift(this.aggregateData[key].txFee);
        // }

        return {
            labels: labels,
            data: [
                size,
                diff,
                txFee,
                txCount,
                blockType,
            ],
        }
    }

    // private getDateIndex(date: Date, dataIntervalInMinutes: number): LabelData {
    //     var minutes = "00";
    //     const rawMinuteValue = date.getMinutes();
    //     const month = (date.getMonth() + 1).toString().padStart(2, '0');
    //     const day = date.getDate().toString().padStart(2, '0');
    //     const hour = date.getHours().toString().padStart(2, '0');

    //     // More than a day
    //     if(dataIntervalInMinutes >= 60 * 6) {
    //         return {
    //             label: month + '/' + day,
    //             key: month + '-' + day,
    //         };
    //     }
        
    //     // More than an hour
    //     if(dataIntervalInMinutes >= 60) {
    //         return {
    //             label: month + '/' + day + ' ' + hour + ':00',
    //             key: month + '-' + day + '_' + hour + ':00',
    //         };
    //     }
        
    //     // Less than an hour
    //     if(rawMinuteValue < dataIntervalInMinutes) {
    //         minutes = "00";
    //     }

    //     if(rawMinuteValue >= dataIntervalInMinutes) {
    //         if((rawMinuteValue % dataIntervalInMinutes) > 0) {                        
    //             minutes = (
    //                 rawMinuteValue - 
    //                 (rawMinuteValue % dataIntervalInMinutes)
    //             ).toString().padStart(2, '0');
    //         } else {
    //             minutes = rawMinuteValue.toString().padStart(2, '0');
    //         }
    //     }
    //     return {
    //         label: month + '/' + day + ' ' + hour + ':' + minutes,
    //         key: month + '-' + day + '_' + hour + ':' + minutes,
    //     };
    // }
}