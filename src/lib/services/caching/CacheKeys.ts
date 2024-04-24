type CacheData = {
    key: string,
    ttl: number
}
export class CacheKeys {
    //Remove this. ptr has no use
    static PointerPrefix: CacheData = { key: "ptr:", ttl: 3600 };
    static BlockchainHeight: CacheData = { key: "blockchain_height:", ttl: 60 }; //OK
    static BlockchainStatus: CacheData = { key: "blockchain_status:", ttl: 60 }; //OK
    static BlockSummaryPrefix: CacheData = { key: "block_summary:", ttl: 3600 };
    static BlockInfoByHashPrefix: CacheData = { key: "block_info_by_hash:", ttl: 300 }; //OK
    static BlockInfoByHeightPrefix: CacheData = { key: "block_info_by_height:", ttl: 3600 };
    static BlockRawTransactionPrefix: CacheData = { key: "block_raw_tx:", ttl: 3600 };
    static BlockHashesListPrefix: CacheData = { key: "block_hashes_list:", ttl: 216000 }; //OK
    static CoinSupplyInfo: CacheData = { key: "supply_info:", ttl: 3600 };
    static TxInfoPrefix: CacheData = { key: "tx_info:", ttl: 86400 }; //OK
    static IdentityInfoPrefix: CacheData = { key: "identity_info:", ttl: 600 }; //OK
    static AddressTxListPrefix: CacheData = { key: "address_tx_list:", ttl: 180 }; //OK
    static AddressBalancePrefix: CacheData = { key: "address_balance:", ttl: 300 }; //OK
}