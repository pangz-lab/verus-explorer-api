import { BlockBasicInfoWithTx } from "../../../models/BlockBasicInfo";
import { ChartData, ChartDataService, ChartDataInterace, ChartDataOptions } from "../ChartDataInterface";

export class BlockBasicInfoChartData 
    extends ChartDataService
    implements ChartDataInterace {
    private blockInfo: BlockBasicInfoWithTx[];

    constructor(blockInfo: BlockBasicInfoWithTx[], options?: ChartDataOptions) {
        super();
        this.blockInfo = blockInfo;
    }

    process(): ChartDataInterace { return this; }

    format(): ChartData {
        var labels = [];
        var size = [];
        var diff = [];
        var totalTxFee = [];
        var txCount = [];
        var blockType = [];
        var minedValue = [];
        var blockTime = [];

        for(var i = 0; i < this.blockInfo.length; i++) {
            const data = this.blockInfo[i];
            const dateIndex = data.height;
            labels.push(dateIndex.toString());
            size.push(data.size / 1e3);
            diff.push(parseFloat((data.difficulty / 1e10).toFixed(4)));
            totalTxFee.push(this.getBlockTxFeeTotal(data.txsFee));
            txCount.push(data.txs.length);
            blockType.push(data.blocktype == 'mined'? 1 : -1);
            minedValue.push(data.minedValue);
            const lastBlock = this.blockInfo[i + 1];
            blockTime.push((lastBlock === undefined)? 0 : data.time - lastBlock.time);
        }

        return {
            labels: labels,
            data: [
                size,
                diff,
                totalTxFee,
                txCount,
                blockType,
                minedValue,
                blockTime,
            ],
        }
    }

    private getBlockTxFeeTotal(data: number[]): number {
        var result = 0;
        for(var i = 0; i < data.length; i++) {
          result += data[i];
        }
        return parseFloat(result.toFixed(4));
    }
}