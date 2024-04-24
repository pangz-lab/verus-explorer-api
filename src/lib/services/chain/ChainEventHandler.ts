import { EventData } from "verus-zmq-client";
import { LatestChainStatePayload, ServicePayload } from "../payload/Payload";
import { Transaction as TransactionService } from "./Transaction";
import { Blockchain as BlockchainService } from "./Blockchain";
import { Block as BlockService } from "./Block";
import { ChainNode } from "../../models/ChainNode";

export class ChainEventHandler {
    private static lastProcessedHeight = 0;
    private static maxRetry = 3;
    
    static async onNewBlockAdded(value: EventData, topic?: string)
        : Promise<LatestChainStatePayload | Object> {
        var blockInfoSummary: any = { "blocks": [] };

        const lastProcessedHeight = ChainEventHandler.lastProcessedHeight;
        const blockInfo: any = await BlockService.getInfo(value as string);
        if(blockInfo == undefined || blockInfo.error || !blockInfo.data) {
            return {[topic as string]: value};
        }
    
        const chainHeight: number = blockInfo.data.height;
        if(ChainEventHandler.lastProcessedHeight >= chainHeight) {
            return {[topic as string]: value};
        }

        const summary: any = await BlockService.saveSummary(blockInfo.data);
        if(summary === undefined) { return {[topic as string]: value}; }
        
        var blockTxs: string[] = [];
        blockInfoSummary["blocks"].push(summary);
        summary.txs.map((e: string) => { if(!blockTxs.includes(e)) { blockTxs.unshift(e); } });

        ChainEventHandler.lastProcessedHeight = chainHeight;
        const txsInfo = await ChainEventHandler.getBlockTxesInfo(blockTxs);
        
        // const result: ServicePayload = await BlockchainService.getStatus();
        // if(result == undefined || result!.error) { return {[topic as string]: value}; }

        // const statsData: any = result.data;
        // const r1 = statsData.at(0)!.data;
        // const r2 = statsData.at(1)!.data;
        // const r3 = statsData.at(2)!.data;
        // const blockchainStatus = {
        //     // R1
        //     'VRSCversion': 'v' + r1.VRSCversion,
        //     'protocolVersion': r1.protocolversion,
        //     'blocks': r1.blocks,
        //     'longestchain': r1.longestchain,
        //     'connections': r1.connections,
        //     'difficulty': r1.difficulty,
        //     'version': r1.version,
        //     //R2
        //     'networkHashrate': r2.networkhashps,
        //     // R3
        //     'circulatingSupply': r3.supply,
        //     'circulatingSupplyTotal': r3.total,
        //     'circulatingZSupply': r3.zfunds,
        // };

        const blockchainStatus = await ChainEventHandler.getBlockchainStatus();
        if(blockchainStatus == undefined) { return {[topic as string]: value}; }

        blockInfoSummary = { data: blockInfoSummary, error: false };
        const status = { data: blockchainStatus, error: false };
        const latestTxs = { data: txsInfo, error: false };
        const nodeState = { data: ChainNode.getState(), error: false };

        const payload: LatestChainStatePayload = {
            status: status,
            latestBlocks: blockInfoSummary,
            latestTxs: latestTxs,
            nodeState: nodeState,
        };
        return payload;
    }

    private static async getBlockchainStatus(): Promise< undefined | Object> {
        const result: ServicePayload = await BlockchainService.getStatus();
        if(result == undefined || result!.error) { return undefined }

        const statsData: any = result.data;
        const r1 = statsData.at(0)!.data;
        const r2 = statsData.at(1)!.data;
        const r3 = statsData.at(2)!.data;

        ChainNode.setState({
            sync: r1.blocks == r1.longestchain,
            blocks: r1.blocks,
            longestChain: r1.longestchain,
            syncPercentage: undefined
        });

        return {
            // R1
            'VRSCversion': 'v' + r1.VRSCversion,
            'protocolVersion': r1.protocolversion,
            'blocks': r1.blocks,
            'longestchain': r1.longestchain,
            'connections': r1.connections,
            'difficulty': r1.difficulty,
            'version': r1.version,
            //R2
            'networkHashrate': r2.networkhashps,
            // R3
            'circulatingSupply': r3.supply,
            'circulatingSupplyTotal': r3.total,
            'circulatingZSupply': r3.zfunds,
        };
    }

    private static async getBlockTxesInfo(blockTxs: string[]): Promise<Object[]> {
        var txsInfo = [];
        var retryCounter = 0;
        for(var index = 0; index < blockTxs.length; index++) {
            var txInfo: any = await TransactionService.getInfo((blockTxs.at(index) as string));
            retryCounter = 0;

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

        return txsInfo;
    }
}