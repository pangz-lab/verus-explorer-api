import { BlockBasicInfoWithTx } from "../../../models/BlockBasicInfo";
import { ChartService } from "../../../services/chart/ChartService";
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
        var totalBlockVoutValue = [];
        var highestVout = 0;
        // const conversion = ChartService.getConversionUnit(data.blockHighestVout)

        for(var i = 0; i < this.blockInfo.length; i++) {
            const data = this.blockInfo[i];
            const dateIndex = data.height;

            labels.push(dateIndex.toString());
            size.push(data.size / 1e3);
            diff.push(parseFloat((data.difficulty / 1e12).toFixed(4)));
            totalTxFee.push(ChartService.getSum(data.blockFeesPerTx));
            txCount.push(data.txs.length);
            blockType.push(data.blocktype == 'mined'? 1 : -1);
            minedValue.push(data.blockMiningReward);
            
            const prevBlock = this.blockInfo[i + 1];
            blockTime.push((prevBlock === undefined)? 0 : data.time - prevBlock.time);
            totalBlockVoutValue.push(ChartService.getSum(data.blockTotalVoutPerTx));

            if(totalBlockVoutValue[i] > highestVout) {
                highestVout = totalBlockVoutValue[i];
            }
        }

        const conversion = ChartService.getConversionUnit(highestVout);
        // if(conversion!.value >= 1e6) {
            for(var i = 0; i < totalBlockVoutValue.length; i++) {
                totalBlockVoutValue[i] = parseFloat((totalBlockVoutValue[i] / conversion!.value).toFixed(2));
            }
        // }

        return {
            labels: labels,
            data: {
                'size': {data: size, options: {}},
                'diff': {data: diff, options: {}},
                'totalTxFee': {data: totalTxFee, options: {}},
                'txCount': {data: txCount, options: {}},
                'blockType': {data: blockType, options: {}},
                'minedValue': {data: minedValue, options: {}},
                'blockTime': {data: blockTime, options: {}},
                'totalBlockVoutValue': {data: totalBlockVoutValue, options: { conv: conversion }}
            },
        }
    }
}