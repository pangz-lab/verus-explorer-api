type NodeState = {
    sync: boolean,
    blocks: number,
    longestChain: number,
    syncPercentage?: number
}

export class ChainNode {
    private static state: NodeState = {
        sync: false,
        blocks: -1,
        longestChain: 1,
        syncPercentage: undefined
    };

    static getState(): undefined | NodeState {
        return ChainNode.state;
    }

    static setState(state: NodeState): void {
        if(state.syncPercentage == undefined) {
            const syncPercentage = state.blocks == state.longestChain?
            100 : 
            (state.blocks < state.longestChain) ?
                (100 / state.longestChain) * state.blocks :
                0
            state = {
                sync: state.sync,
                blocks: state.blocks,
                longestChain: state.longestChain,
                syncPercentage: syncPercentage
            }
        }

        ChainNode.state = {
            sync: state.sync,
            blocks: state.blocks,
            longestChain: state.longestChain,
            syncPercentage: state.syncPercentage,
        };
    }
}