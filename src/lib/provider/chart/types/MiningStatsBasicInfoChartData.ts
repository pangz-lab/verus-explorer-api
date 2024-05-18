import { MiningStatsBasicInfo } from "../../../models/MiningStats";
import { ChartData, ChartDataService, ChartDataInterace, ChartDataOptions } from "../ChartDataInterface";

export class MiningStatsBasicInfoChartData 
    extends ChartDataService
    implements ChartDataInterace {
    private miningStatsInfo: MiningStatsBasicInfo[];

    constructor(blockInfo: MiningStatsBasicInfo[], options?: ChartDataOptions) {
        super();
        this.miningStatsInfo = blockInfo;
    }

    process(): ChartDataInterace { return this; }

    format(): ChartData {
        var labels = [];
        var hashRate = [];
        var detail = [];
        // var size = [];
        // var diff = [];
        // var totalTxFee = [];
        // var txCount = [];
        // var blockType = [];
        // var minedValue = [];
        // var blockTime = [];
        // var totalBlockVoutValue = [];

        for(var i = 0; i < this.miningStatsInfo.length; i++) {
            const data = this.miningStatsInfo[i];
            // const dateIndex = data.height;
            labels.push(data.poolId);
            hashRate.push(parseFloat((data.hashrate / 1e9).toFixed(4)));
            detail.push(data);
            // size.push(data.size / 1e3);
            // diff.push(parseFloat((data.difficulty / 1e12).toFixed(4)));
            // totalTxFee.push(ChartService.getSum(data.blockFeesPerTx));
            // txCount.push(data.txs.length);
            // blockType.push(data.blocktype == 'mined'? 1 : -1);
            // minedValue.push(data.blockMiningReward);
            
            // const lastBlock = this.miningStatsInfo[i + 1];
            // blockTime.push((lastBlock === undefined)? 0 : data.time - lastBlock.time);
            // totalBlockVoutValue.push(ChartService.getSum(data.blockTotalVoutPerTx));
        }

        return {
            labels: labels,
            data: {
                'hashRate': {data: hashRate, options: {}},
                'detail': {data: detail, options: {}},
                // 'diff': {data: diff, options: {}},
                // 'totalTxFee': {data: totalTxFee, options: {}},
                // 'txCount': {data: txCount, options: {}},
                // 'blockType': {data: blockType, options: {}},
                // 'minedValue': {data: minedValue, options: {}},
                // 'blockTime': {data: blockTime, options: {}},
                // 'totalBlockVoutValue': {data: totalBlockVoutValue, options: {}}
            },
        }
    }
}