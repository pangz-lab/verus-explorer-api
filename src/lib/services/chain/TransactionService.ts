import { ServicePayload, Payload } from "../Payload";
import { ChainNativeApi } from "./ChainNativeApi";

export type BlockTxInfoSummary = {
    txid: string,
    vout: string,
    time: number,
    height: number,
    blockhash: string,
}


export type TxBasicInfo = {
    txFee: number,
    totalVout: number,
    miningReward: number,
    isMinedBlockTx: boolean
};

// type TxDetail = {
//     // txsDetail: Array<{[key: string]: any }>,
//     minedDataTx: string,
//     minedValue: number,
//     txsFee: number[]
// };

export class TransactionService {
    static async getInfo(txHash: string): Promise<ServicePayload> {
        try {
            var data: any;
            const response: any = await ChainNativeApi.getTransactionInfo(txHash);
            if(response.status != 200 || response.data.error) {
                Payload.logError(
                    'fetch transaction info',
                    `Data: ${txHash!}`,
                    `getInfo`);
                return Payload.withError();
            }

            data = response.data.result;
            if(data === undefined) { return Payload.withError();}

            return Payload.withSuccess(data);
        } catch(e) {
            Payload.logError(
                'fetch transaction info - [Exception] : ' + e,
                `Data: ${txHash!}`,
                `getInfo`); 
            return Payload.withError();
        }
    }

    static async decodeRaw(hexString: string): Promise<Object> {
        try {
            var data: any;
            const response: any = await ChainNativeApi.decodeBlockRawTransaction(hexString);
            if(response.status != 200 || response.data.error) {
                Payload.logError(
                    'fetch decoded block raw transaction',
                    `Key: -`,
                    `decodeRaw`);
                return Payload.withError();
            }
            
            data = response.data.result;
            if(data === undefined) { return Payload.withError(); }

            return Payload.withSuccess(data);
        } catch (e) {
            Payload.logError(
                'fetch decoded block raw transaction - [Exception] : ' + e,
                `Key: -`,
                `decodeRaw`);
            return Payload.withError();
        }
    }

    static async getBlockTxsInfoSummary(blockTxs: string[]): Promise<BlockTxInfoSummary[]> {
        var txsInfo = [];
        // var retryCounter = 0;
        for(var index = 0; index < blockTxs.length; index++) {
            const txInfo: any = await TransactionService.getInfo((blockTxs.at(index) as string));
            // retryCounter = 0;

            // while(txInfo.error && retryCounter < 3) {
            //     txInfo = await TransactionService.getInfo((blockTxs.at(index) as string));
            //     retryCounter += 1;
            // }
            
            if(txInfo.error) { continue; }
            const d = txInfo.data;
            txsInfo.push({
                txid: d.txid,
                vout: d.vout,
                time: d.time,
                height: d.height,
                blockhash: d.blockhash,
            });
        }

        return txsInfo;
    }
    
    static async getBasicInfo(tx: string): Promise<undefined | TxBasicInfo> {
        // var retryCounter = 0;
        
        const txInfo: any = await TransactionService.getInfo(tx);
        // retryCounter = 0;

        // while(txInfo.error && retryCounter < 3) {
        //     txInfo = await TransactionService.getInfo(tx);
        //     retryCounter += 1;
        // }
        
        if(txInfo.error) { return undefined; }
        const d = txInfo.data;

        const extra = TransactionService.getTxExtraData(txInfo.data);
        return {
            txFee: extra.txFee,
            totalVout: extra.totalVout,
            miningReward: extra.miningReward,
            isMinedBlockTx: extra.isMinedBlockTx,
        }
    }

    private static getTxExtraData(txDetail: any): TxBasicInfo {
        const decimal = 8;
        var txData = txDetail as {[key: string]: any };
        var txVinTotalValue: number = 0;
        var txVoutTotalValue: number = 0;
        var txVinFirstItem: number = txData?.vin[0];
        var txVoutFirstItem: number = txData?.vout[0];
        var txValueBalance: number = txData?.valueBalance;
        var miningReward = 0;
        var txFee = 0;
        const isMinedBlockTx = txDetail?.vin[0] != undefined
            && txDetail?.vin[0]["coinbase"] !== undefined
            && txDetail?.vout[0]["value"] !== undefined;
            miningReward = 0;

        var index = 0;
        while(txDetail?.vin[index] !== undefined) {
            txVinTotalValue += txDetail?.vin[index]["value"];
            index += 1;
        }

        index = 0;
        while(txDetail?.vout[index] !== undefined) {
            txVoutTotalValue += txDetail?.vout[index]["value"];
            index += 1;
        }

        if(isMinedBlockTx) {
            miningReward += txVoutTotalValue;
        } else {
            txFee = parseFloat((txVinTotalValue - txVoutTotalValue).toFixed(decimal));
            if (txValueBalance != undefined) {
                if (txVoutFirstItem == undefined) {
                    txFee = parseFloat((txValueBalance + txVinTotalValue).toFixed(decimal));
                } else if (txVinFirstItem == undefined) {
                    txFee = parseFloat((txValueBalance - txVoutTotalValue).toFixed(decimal));
                } else {
                    txFee = parseFloat(((txVinTotalValue - txVoutTotalValue) + txValueBalance).toFixed(8));
                }
            }
        }

        return {
            txFee: txFee,
            miningReward: miningReward,
            isMinedBlockTx: isMinedBlockTx,
            totalVout: txVoutTotalValue,
        };
    }
}