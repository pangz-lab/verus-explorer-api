// import 'dotenv/config';
// import axios from 'axios';
// import { VerusdRpcInterface } from "verusd-rpc-ts-client";
// import { ChainApiInterface } from "../../models/ChainApiInterface";

// class ChainExternalApi {
//     private static readonly url = process.env.EXT_API_HOST!.toString();
//     private static createPayload(): Record<string, string> {
//         return {
//             'Content-Type': 'application/json',
//             "Authorization": process.env.EXT_API_AUTH_TOKEN!.toString()
//         }
//     }

//     static async send(method: string, params: Object): Promise<Object> {
//         const payload = {"jsonrpc": "1.0", "id":"curltest", "method": method, "params": params}
//         return await axios.post(
//             this.url,
//             payload,
//             this.createPayload());
//     }
// }

// export class ChainNativeApi 
// implements ChainApiInterface {
//     private readonly verusd: VerusdRpcInterface;
//     readonly methodMap = new Map<string, string>([
//         ['getinfo', 'getInfo'],
//         ['getmininginfo', 'getMiningInfo'],
//         ['coinsupply', 'getCoinSupply'],
//         ['getrawtransaction', 'getRawTransaction'],
//         ['getblock', 'getBlockDetail'],
//         ['getblockcount', 'getBlockCount'],
//         ['getidentity', 'getIdentity'],
//         ['getaddresstxids', 'getAddressTxIds'],
//         ['getaddressbalance', 'getAddressBalance'],
//         ['getblockhashes', 'getBlockHashes'],
//         ['getblockchaininfo', 'getBlockchainInfo'],
//     ]);

//     constructor(verusdRpc: VerusdRpcInterface) {
//         this.verusd = verusdRpc;
//     }
    
//     async getInfo(): Promise<Object> {
//         return await ChainExternalApi.send('getinfo', []);
//     }

//     async getMiningInfo(): Promise<Object> {
//         return await ChainExternalApi.send('getmininginfo', []);
//     }

//     async getCoinSupply(): Promise<Object> {
//         return await ChainExternalApi.send('coinsupply', []);
//     }

//     async getRawTransaction(heightOrTx: string): Promise<Object> {
//         return await ChainExternalApi.send('getrawtransaction', [heightOrTx]);
//     }
    
//     async decodeBlockRawTransaction(hexString: string): Promise<Object> {
//         return await ChainExternalApi.send('decoderawtransaction', [hexString]);
//     }
    
//     async getTransactionInfo(heightOrTx: string): Promise<Object> {
//         return await ChainExternalApi.send('getrawtransaction', [heightOrTx, 1]);
//     }

//     async getBlockDetail(heightOrHash: string | number): Promise<Object> {
//         return await ChainExternalApi.send('getblock', [heightOrHash]);
//     }

//     async getBlockCount(): Promise<Object> {
//         return await ChainExternalApi.send('getblockcount', []);
//     }

//     async getIdentity(identityName: string, height?: number): Promise<Object> {
//         // return this.verusd.getIdentity(params[0], parseInt(params[1] ?? "0"));
//         // return await this.verusd.getIdentity(identityName, height);
//         return await ChainExternalApi.send("getidentity", [identityName, height].filter(e => typeof e == 'string'));
//     }

//     async getAddressTxIds(addresses: string[]): Promise<Object> {
//         return await ChainExternalApi.send("getaddresstxids", [{"addresses": addresses}]);
//     }

//     async getAddressBalance(addresses: string[]): Promise<Object> {
//         return await ChainExternalApi.send('getaddressbalance', [{"addresses": addresses}]);
//         // return this.verusd.getAddressBalance({
//         //     addresses: ((params as string[])[0] as Object)!.addresses
//         // });
//     }

//     async getBlockHashes(dateTime: string[]): Promise<Object> {
//         return await ChainExternalApi.send("getblockhashes", [...dateTime.map(e => parseInt(e))]);
//     }

//     async getBlockchainInfo(): Promise<Object> {
//         return await ChainExternalApi.send('getblockchaininfo', []);
//     }
// }