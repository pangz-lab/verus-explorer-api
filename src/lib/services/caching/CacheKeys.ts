type CacheData = {
    key: string,
    ttl: number
}
export class CacheKeys {
    //Remove this. ptr has no use
    static PointerPrefix: CacheData = { key: "ptr:", ttl: 3600 };
    static BlockchainHeight: CacheData = { key: "blockchain_height:", ttl: 60 }; //OK
    static BlockchainStatus: CacheData = { key: "blockchain_status:", ttl: 3600 }; //OK
    static BlockSummaryPrefix: CacheData = { key: "block_summary:", ttl: 3600 };
    static BlockInfoByHashPrefix: CacheData = { key: "block_info_by_hash:", ttl: 60 * 60 * 24 * 30 }; //OK
    static BlockInfoByHeightPrefix: CacheData = { key: "block_info_by_height:", ttl: 3600 };
    static BlockRawTransactionPrefix: CacheData = { key: "block_raw_tx:", ttl: 3600 };
    static BlockHashesListPrefix: CacheData = { key: "block_hashes_list:", ttl: 216000 }; //OK
    static CoinSupplyInfo: CacheData = { key: "supply_info:", ttl: 3600 };
    
    static TxInfoPrefix: CacheData = { key: "tx_info:", ttl: 86400 }; //OK
    static TxBasicInfoPrefix: CacheData = { key: "tx_basic_info:", ttl: 86400 }; //OK
    
    static IdentityInfoPrefix: CacheData = { key: "identity_info:", ttl: 600 }; //OK
    
    static AddressTxListPrefix: CacheData = { key: "address_tx_list:", ttl: 60 * 10 }; //OK
    static AddressBalancePrefix: CacheData = { key: "address_balance:", ttl: 60 * 5 }; //OK
    
    static SearchQueryPrefix: CacheData = { key: "search:", ttl: 60 * 60 }; //OK
    static StatsMiningDataPrefix: CacheData = { key: "stats:", ttl: 60 * 15 }; //OK
    
    static ChartRawDataLongPrefix: CacheData = { key: "chart_raw_data_long:", ttl: 60 * 60 * 24 }; //OK
    static ChartRawDataShortPrefix: CacheData = { key: "chart_raw_data_short:", ttl: 180 }; //OK
    static ChartDataGenExecFlagPrefix: CacheData = { key: "chart_raw_data_gen_exec_stats:", ttl: 60 * 10 }; //TTL used to set lock/unlock chart data generation
    static ChartDispDataPrefix: CacheData = { key: "chart_disp_data:", ttl: 1 }; //TTL used is defined in the controller
    
    static ChainCurrentStatePrefix: CacheData = { key: "chain_current_state:", ttl: 300 }; //OK
    static ChainLastProcessedHeight: CacheData = { key: "chain_last_processed_height:", ttl: 600 }; //OK
    static AggregatorDataPrefix: CacheData = { key: "agg_data:", ttl: 60 * 10 }; //OK
    static RawDataGenExecFlagPrefix: CacheData = { key: "raw_data_gen_exec_stats:", ttl: 60 * 15 }; //OK
}