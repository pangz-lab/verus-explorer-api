import { EventData } from "verus-zmq-client";
import { WsServer } from "../../infra/network/WsServer";
import { LatestChainStatePayload } from "../payload/Payload";
import { Block as BlockService } from "./Block";
import { Transaction as TransactionService } from "./Transaction";
import { Blockchain as BlockchainService } from "./Blockchain";

export class ChainEventHandler {
    private static lastProcessedHeight = 0;
    private static maxRetry = 3;
    
    static async onNewBlockAdded(
        wss: WsServer,
        value: EventData,
        topic?: string
    ) {
        var blockInfoSummary: any = { "blocks": [] };

        const lastProcessedHeight = ChainEventHandler.lastProcessedHeight;
        const blockInfo: any = await BlockService.getInfo(value as string);
        if(blockInfo.error || !blockInfo.data) {
            wss.send({[topic as string]: value});
            return;
        }
    
        const chainHeight: number = blockInfo.data.height;
        if(ChainEventHandler.lastProcessedHeight >= chainHeight) {
            wss.send({[topic as string]: value});
            return;
        }

        if(lastProcessedHeight < chainHeight) {
            var blockTxs: string[] = [];
    
            const summary: any = await BlockService.saveSummary(blockInfo.data);
            if(summary === undefined) {
                wss.send({[topic as string]: value});
                return;
            }
    
            blockInfoSummary["blocks"].push(summary);
            summary.txs.map((e: string) => {
                if(!blockTxs.includes(e)) { blockTxs.unshift(e); }
            });

            ChainEventHandler.lastProcessedHeight = chainHeight;
    
            var txsInfo = [];
            var retryCounter = 0;
            for(var index = 0; index < blockTxs.length; index++) {
                var txInfo: any = await TransactionService.getInfo((blockTxs.at(index) as string));
                retryCounter = 0;
                
                console.log(chainHeight + ' ' + blockTxs.at(index));
                
                while(txInfo.error && retryCounter < ChainEventHandler.maxRetry) {
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
            
            blockInfoSummary = { data: blockInfoSummary, error: false };
            const latestTxs = { data: txsInfo, error: false };
            const blockchainStatus = await BlockchainService.getStatus();
            const payload: LatestChainStatePayload = {
                status: blockchainStatus,
                latestBlocks: blockInfoSummary,
                latestTxs: latestTxs,
            };
            wss.send(payload);
        }
    }
    
}