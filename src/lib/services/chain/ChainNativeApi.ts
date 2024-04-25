import { ChainExternalApi } from "./ChainExternalApi";

export class ChainNativeApi {
    static async getInfo(): Promise<Object> {
        return await ChainExternalApi.send('getinfo', []);
    }

    static async getMiningInfo(): Promise<Object> {
        return await ChainExternalApi.send('getmininginfo', []);
    }

    static async getCoinSupply(): Promise<Object> {
        return await ChainExternalApi.send('coinsupply', []);
    }

    static async getRawTransaction(heightOrTx: string): Promise<Object> {
        return await ChainExternalApi.send('getrawtransaction', [heightOrTx]);
    }
    
    static async decodeBlockRawTransaction(hexString: string): Promise<Object> {
        return await ChainExternalApi.send('decoderawtransaction', [hexString]);
    }
    
    static async getTransactionInfo(txHash: string): Promise<Object> {
        return await ChainExternalApi.send('getrawtransaction', [txHash, 1]);
    }

    static async getBlockDetail(heightOrHash: string | number): Promise<Object> {
        return await ChainExternalApi.send('getblock', [heightOrHash]);
    }

    static async getBlockCount(): Promise<Object> {
        return await ChainExternalApi.send('getblockcount', []);
    }

    static async getIdentity(identityName: string, height?: number): Promise<Object> {
        return await ChainExternalApi.send("getidentity", [identityName, height].filter(e => typeof e == 'string'));
    }

    static async getAddressTxIds(addresses: string[]): Promise<Object> {
        return await ChainExternalApi.send("getaddresstxids", [{"addresses": addresses}]);
    }

    static async getAddressBalance(addresses: string[]): Promise<Object> {
        return await ChainExternalApi.send('getaddressbalance', [{"addresses": addresses}]);
    }

    static async getBlockHashes(dateTime: string[]): Promise<Object> {
        return await ChainExternalApi.send("getblockhashes", [...dateTime.map(e => parseInt(e))]);
    }

    static async getBlockchainInfo(): Promise<Object> {
        return await ChainExternalApi.send('getblockchaininfo', []);
    }
}