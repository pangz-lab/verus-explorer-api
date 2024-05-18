export type BlockBasicInfo = {
    anchor: string,
    bits: string,
    blocktype: string,
    difficulty: number,
    hash: string,
    height: number,
    nonce: string,
    previousblockhash: number,
    size: number,
    segid: number,
    time: number,
    version: number,
    validationtype: string,
    txs: string[]
}

export interface BlockBasicInfoWithTx extends BlockBasicInfo {
    txsDetail: Array<Object>
    blockMiningDataTx: string,
    blockMiningReward: number,
    blockTotalVoutPerTx: number[],
    blockFeesPerTx: number[],
    blockHighestVout: number,
}