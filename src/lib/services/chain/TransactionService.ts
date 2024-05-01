import { ServicePayload, Payload } from "../payload/Payload";
import { ChainNativeApi } from "./ChainNativeApi";

export type BlockTxInfoSummary = {
    txid: string,
    vout: string,
    time: number,
    height: number,
    blockhash: string,
}

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
        var retryCounter = 0;
        for(var index = 0; index < blockTxs.length; index++) {
            var txInfo: any = await TransactionService.getInfo((blockTxs.at(index) as string));
            retryCounter = 0;

            while(txInfo.error && retryCounter < 3) {
                txInfo = await TransactionService.getInfo((blockTxs.at(index) as string));
                retryCounter += 1;
            }
            
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
}