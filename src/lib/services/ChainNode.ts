export type ChainNodeState = {
    sync: boolean,
    blocks: number,
    longestChain: number,
    blockHash: string,
    longestChainBlockHash: string,
    syncPercentage?: number,
    message?: string,
}

export class ChainNode {
    private static state: ChainNodeState = {
        sync: false,
        blocks: -1,
        longestChain: 1,
        blockHash: "-1",
        message: "",
        longestChainBlockHash: "1",
        syncPercentage: undefined
    };

    static getState(): undefined | ChainNodeState {
        return ChainNode.state;
    }

    static setState(state: ChainNodeState): void {
        if(state.syncPercentage === undefined) {
            const syncPercentage = state.blocks == state.longestChain?
            100 : 
            (state.blocks < state.longestChain) ?
                (100 / state.longestChain) * state.blocks :
                0
            const message = syncPercentage == 100? "💯 COMPLETE": "🚧 SYNCING ...";
            state.sync = syncPercentage == 100;
            state = {
                sync: state.sync,
                blocks: state.blocks,
                longestChain: state.longestChain,
                blockHash: state.blockHash,
                longestChainBlockHash: state.longestChainBlockHash,
                syncPercentage: parseFloat((syncPercentage).toFixed(2)),
                message: message,
            }
        }

        ChainNode.state = state;
    }
}