import { HttpService } from "../HttpService";
export type Range = {
    start: number,
    end: number,
}

export class ChainNativeApi {
    static async getInfo(): Promise<Object> {
        return await HttpService.sendChainRpcRequest('getinfo', []);
    }

    static async getMiningInfo(): Promise<Object> {
        return await HttpService.sendChainRpcRequest('getmininginfo', []);
    }

    static async getCoinSupply(): Promise<Object> {
        return await HttpService.sendChainRpcRequest('coinsupply', []);
    }

    static async getRawTransaction(heightOrTx: string): Promise<Object> {
        return await HttpService.sendChainRpcRequest('getrawtransaction', [heightOrTx]);
    }
    
    static async decodeBlockRawTransaction(hexString: string): Promise<Object> {
        return await HttpService.sendChainRpcRequest('decoderawtransaction', [hexString]);
    }
    
    static async getTransactionInfo(txHash: string): Promise<Object> {
        return await HttpService.sendChainRpcRequest('getrawtransaction', [txHash, 1]);
    }

    static async getBlockDetail(heightOrHash: string | number): Promise<Object> {
        return await HttpService.sendChainRpcRequest('getblock', [heightOrHash]);
    }

    static async getBlockCount(): Promise<Object> {
        return await HttpService.sendChainRpcRequest('getblockcount', []);
    }

    static async getIdentity(identityName: string, height?: number): Promise<Object> {
        return await HttpService.sendChainRpcRequest("getidentity", [identityName, height].filter(e => typeof e == 'string'));
    }

    static async getAddressTxIds(addresses: string[], range?: Range): Promise<Object> {
        var params: Object = [{"addresses": addresses}];
        if(range !== undefined) {
            params = [{"addresses": addresses, "start": range.start, "end": range.end }];
        }
        return await HttpService.sendChainRpcRequest("getaddresstxids", params);
    }

    static async getAddressBalance(addresses: string[]): Promise<Object> {
        return await HttpService.sendChainRpcRequest('getaddressbalance', [{"addresses": addresses}]);
    }

    static async getBlockHashes(dateTime: string[]): Promise<Object> {
        return await HttpService.sendChainRpcRequest("getblockhashes", [...dateTime.map(e => parseInt(e))]);
    }

    static async getBlockchainInfo(): Promise<Object> {
        return await HttpService.sendChainRpcRequest('getblockchaininfo', []);
    }
    
    static async decodeHexScript(hexScript: string): Promise<Object> {
        return await HttpService.sendChainRpcRequest('decodescript', [hexScript]);
    }
}