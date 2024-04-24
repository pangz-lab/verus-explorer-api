// import 'dotenv/config';
// import { ChainNativeApi } from "./ChainNativeApi";
// import { RedisCaching } from '../../infra/caching/RedisCaching';
// import { CacheKeys, CachingServiceInterface } from "../../models/CachingServiceInterface";
// import { ErrorPayload, SuccessPayload } from '../payload/Payload';

// //Remove this after changing to controllers
// class ChainApiCaching {
//     private cache: CachingServiceInterface;
//     readonly useCaching: boolean = false;
//     constructor(cache: CachingServiceInterface, useCache: boolean) {
//         this.cache = cache
//         this.useCaching = useCache;
//     }

//     setBlockInfo(
//         blockHash: string,
//         blockHeight: string,
//         data: any,
//         expiry?: number
//     ): void {
//         const baseKey = CacheKeys.BlockInfoByHashPrefix + blockHash;
//         this.set(baseKey, data, expiry);
//         this.set(
//             CacheKeys.BlockInfoByHeightPrefix + blockHeight,
//             CacheKeys.PointerPrefix + baseKey,
//             expiry
//         );
//     }

//     set(key: string, value: any, expiry?: number): ChainApiCaching {
//         if(!this.useCaching) { return this; }
//         (this.cache as RedisCaching).set(key, JSON.stringify(value), expiry);
//         return this;
//     }

//     async get(key: string): Promise<string | undefined> {
//         try {
//             if(!this.useCaching) { return undefined; }
//             const d = JSON.parse(await this.cache.get(key) as string);
//             if(d == null) { return undefined; }
//         } catch (_) {
//             return undefined;
//         }
//     }
// }

// export class ChainApi {
//     private cache: ChainApiCaching;
//     constructor(
//         cache: CachingServiceInterface,
//         useCache: boolean
//     ) {
//         this.cache = new ChainApiCaching(cache, useCache);
//     }
    
//     // DONE
//     async getTransactionInfo(blockHeightOrHash: string): Promise<Object> {
//         const cacheKey = CacheKeys.TxInfoPrefix + blockHeightOrHash;
//         const CACHE_EXP_TRANSACTION_INFO = 86400;
//         var data: any;

//         try {
//             data = await this.cache.get(cacheKey);
//             if(data == undefined) {
//                 const response: any = await ChainNativeApi.getTransactionInfo(blockHeightOrHash);
//                 if(response.status != 200 || response.data.error) {
//                     this._showError(
//                         'fetch transaction info',
//                         `Data: ${blockHeightOrHash!}`,
//                         `getTransactionInfo`);
//                     return this._errorPayload();
//                 }

//                 data = response.data.result;
//                 if(data == undefined) { return this._errorPayload();}
//                 this.cache.set(cacheKey, data, CACHE_EXP_TRANSACTION_INFO);
//             }

//             return this._successPayload(data);

//         } catch(e) {
//             this._showError(
//                 'fetch transaction info',
//                 `Data: ${blockHeightOrHash!}`,
//                 `getTransactionInfo`); 
//             return this._errorPayload();
//         }
//     }
    
//     //DONE
//     async getHeight(): Promise<Object> {
//         const cacheKey = CacheKeys.BlockchainHeight;
//         const CACHE_EXP_BLOCKCHAIN_HEIGHT = 60;
//         var data: any;

//         try {
//             data = await this.cache.get(cacheKey);
//             if(data == undefined) {
//                 const response: any = await ChainNativeApi.getBlockCount();
//                 if(response.status != 200 || response.data.error) {
//                     this._showError(
//                         'fetch blockchain height',
//                         `Data: -`,
//                         `getHeight`);
//                     return this._errorPayload();
//                 }
                
//                 data = response.data.result;
//                 if(data == undefined) { return this._errorPayload(); }
//                 this.cache.set(cacheKey, data, CACHE_EXP_BLOCKCHAIN_HEIGHT);
//             }
//         } catch(e) {
//             this._showError(
//                 'fetch blockchain height',
//                 `Data: -`,
//                 `getHeight`); 
//             return this._errorPayload();
//         }

//         return this._successPayload(data);
//     }
    
//     //DONE
//     async getBlockchainInfo(): Promise<Object> {
//         var data: any;
//         try {
//             const response: any = await ChainNativeApi.getInfo();
//             if(response.status != 200 || response.data.error) {
//                 this._showError(
//                     'fetch blockchain info',
//                     `Data: -`,
//                     `getBlockchainInfo`);
//                 return this._errorPayload();
//             }
            
//             data = response.data.result;
//             if(data == undefined) { return this._errorPayload(); }
//             // this.cache.set(cacheKey, data, CACHE_EXP_BLOCKCHAIN_HEIGHT);

//             return this._successPayload(data);
//         } catch(e) {
//             this._showError(
//                 'fetch blockchain info',
//                 `Data: -`,
//                 `getBlockchainInfo`); 
//             return this._errorPayload();
//         }
//     }
    
//     //DONE
//     async getMiningInfo(): Promise<Object> {
//         var data: any;
//         try {
//             const response: any = await ChainNativeApi.getMiningInfo();
//             if(response.status != 200 || response.data.error) {
//                 this._showError(
//                     'fetch mining info',
//                     `Data: -`,
//                     `getMiningInfo`);
//                 return this._errorPayload();
//             }
            
//             data = response.data.result;
//             if(data == undefined) { return this._errorPayload(); }

//             return this._successPayload(data);
//         } catch(e) {
//             this._showError(
//                 'fetch mining info',
//                 `Data: -`,
//                 `getMiningInfo`);
//             return this._errorPayload();
//         }
//     }
    
//     //DONE
//     async getCoinSupplyInfo(): Promise<Object> {
//         const cacheKey = CacheKeys.CoinSupplyInfo;
//         const CACHE_EXP_COIN_SUPPLY_INFO = 43200;
//         var data: any;

//         try {
//             data = await this.cache.get(cacheKey);
//             if(data == undefined) {
//                 const response: any = await ChainNativeApi.getCoinSupply();
//                 if(response.status != 200 || response.data.error) {
//                     this._showError(
//                         'fetch coin supply info',
//                         `Data: -`,
//                         `getBlockchainHeight`);
//                     return this._errorPayload();
//                 }
                
//                 data = response.data.result;
//                 if(data == undefined) { return this._errorPayload(); }
//                 this.cache.set(cacheKey, data, CACHE_EXP_COIN_SUPPLY_INFO);
//             }

//             return this._successPayload(data);
//         } catch(e) {
//             this._showError(
//                 'fetch mining info',
//                 `Data: -`,
//                 `getMiningInfo`);
//             return this._errorPayload();
//         }
//     }

//     //DONE
//     async getInfo(blockHeightOrHash: string | number): Promise<Object> {
//         const cacheKeyByHash = CacheKeys.BlockInfoByHashPrefix + blockHeightOrHash;
//         const CACHE_EXP_BLOCK_INFO = 360;
//         var data: any;

//         try {
//             data = await this.cache.get(cacheKeyByHash);
//             if(data == undefined) {
//                 const response: any = await ChainNativeApi.getBlockDetail(blockHeightOrHash);
//                 if(response.status != 200 || response.data.error) {
//                     this._showError(
//                         'fetch block info',
//                         `Data: ${blockHeightOrHash}`,
//                         `getInfo`);
//                     return this._errorPayload();
//                 }

//                 data = response.data.result;
//                 if(data.height == undefined) { return this._errorPayload(); }

//                 this.cache.setBlockInfo(
//                     blockHeightOrHash.toString(),
//                     data.height,
//                     data,
//                     CACHE_EXP_BLOCK_INFO
//                 );
//             }

//             return this._successPayload(data);
//         } catch(e) {
//             this._showError(
//                 'fetch block info',
//                 `Data: ${blockHeightOrHash}`,
//                 `getInfo`);
//             return this._errorPayload();
//         }
//     }

//     //DONE
//     async getHashesByRange(start: number, end: number): Promise<Object> {
//         const rangeLabel = start.toString() + '_' + end.toString();
//         const cacheKey = CacheKeys.BlockHashesListPrefix + rangeLabel;
//         const isDateRangeWithinToday = this._isDateWithinRange(start, end, Math.floor(Date.now() / 1000));
//         const isOneDayRange = ((start - end)/60/60) == 24;
//         const useCache = isOneDayRange && !isDateRangeWithinToday;
//         const CACHE_EXP_BLOCK_HASHES_BY_RANGE = 216000
//         var data: any;

//         try {
//             if(useCache) { data = await this.cache.get(cacheKey); }
//             if(data == undefined) {
//                 const response: any = await ChainNativeApi.getBlockHashes(
//                     [start.toString(), end.toString()]
//                 );
//                 if(response.status != 200 || response.data.error) {
//                     this._showError(
//                         'fetch block hashes',
//                         `Range: ${rangeLabel}`,
//                         `getHashesByRange`);
//                     return this._errorPayload();
//                 }
                
//                 data = response.data.result;
//                 if(data == undefined || data.length === 0) { return this._errorPayload(); }
//                 if(useCache) {
//                     this.cache.set(cacheKey, data, CACHE_EXP_BLOCK_HASHES_BY_RANGE);
//                 }
//             }

//             return this._successPayload(data);
//         } catch(e) {
//             this._showError(
//                 'fetch block hashes',
//                 `Range: ${rangeLabel}`,
//                 `getHashesByRange`);
//             return this._errorPayload();
//         }
//     }

//     //DONE
//     async getGeneratedFromHash(hashList: string[]): Promise<Object> {
//         const CACHE_EXP_BLOCK_INFO = 300;
//         var result: Object[] = [];
//         var data: any;
//         var currentHash: string = '';
//         var cacheKey: string;

//         for(var i = 0; i < hashList.length; i++) {
//             try {
//                 currentHash = hashList[i];
//                 cacheKey = CacheKeys.BlockInfoByHashPrefix + currentHash;
//                 data = await this.cache.get(cacheKey);
//                 if(data == undefined) {
//                     const response: any = await ChainNativeApi.getBlockDetail(currentHash);
//                     if(response.status != 200 || response.data.error) {
//                         this._showError(
//                             'fetch block info',
//                             `Hash: ${currentHash}`,
//                             `getGeneratedFromHash`);
//                         continue;
//                     }

//                     data = response.data.result;
//                     this.cache.setBlockInfo(
//                         currentHash,
//                         data.height,
//                         data,
//                         CACHE_EXP_BLOCK_INFO
//                     );
//                 }
//             } catch(e) {
//                 this._showError(
//                     'fetch block info',
//                     `Hash: ${currentHash}`,
//                     `getGeneratedFromHash`);
//             }

//             result.push({
//                 hash: data?.hash ?? '',
//                 height: data?.height ?? '',
//                 time: data?.time ?? 0,
//                 txCount: data?.tx?.length ?? 0
//             });
//         }
//         return this._successPayload(result);
//     }

//     //DONE
//     async getIdentityInfo(identityName: string, height?: number): Promise<Object> {
//         const cacheKey = CacheKeys.IdentityInfoPrefix + identityName + 
//          (height != undefined ? '_' + height?.toString() : '');
//         const CACHE_EXP_IDENTITY_INFO = 600; //10 minutes
//         var data: any;

//         try {
//             data = await this.cache.get(cacheKey);
//             if(data == undefined) {
//                 const response: any = await ChainNativeApi.getIdentity(identityName, height);
//                 if(response.status != 200 || response.data.error) {
//                     this._showError(
//                         'fetch identity info',
//                         `Identity: ${identityName}`,
//                         `getIdentityInfo`);
//                     return this._errorPayload();
//                 }
                
//                 data = response.data.result;
//                 if(data == undefined) { return this._errorPayload(); }
//                 this.cache.set(cacheKey, data, CACHE_EXP_IDENTITY_INFO);
//             }

//             return this._successPayload(data);
//         } catch(e) {
//             this._showError(
//                 'fetch identity info',
//                 `Identity: ${identityName}`,
//                 `getIdentityInfo`);
//             return this._errorPayload();
//         }
//     }
    
//     // DONE
//     async getTxIds(address: string): Promise<Object> {
//         const cacheKey = CacheKeys.AddressTxListPrefix + address;
//         const CACHE_EXP_ADDRESS_TX_IDS = 3*60; //3 minutes
//         var data: any;
//         try {

//             data = await this.cache.get(cacheKey);
//             if(data == undefined) {
//                 const response: any = await ChainNativeApi.getAddressTxIds([address]);
//                 if(response.status != 200 || response.data.error) {
//                     this._showError(
//                         'fetch address txids',
//                         `Address: ${address}`,
//                         `getTxIds`);
//                     return this._errorPayload();
//                 }
                
//                 data = response.data.result;
//                 if(data == undefined) { return this._errorPayload(); }
//                 this.cache.set(cacheKey, data, CACHE_EXP_ADDRESS_TX_IDS);
//             }

//             return this._successPayload(data);
//         } catch(e) {
//             this._showError(
//                 'fetch address txids',
//                 `Address: ${address}`,
//                 `getTxIds`);
//             return this._errorPayload();
//         }
//     }
    
//     //DONE
//     async decodeRaw(hexString: string): Promise<Object> {
//         const cacheKey = CacheKeys.BlockRawTransactionPrefix + hexString.slice(-32);
//         var data: any;

//         data = await this.cache.get(cacheKey);
//         try {
//             if(data == undefined) {
//                 const response: any = await ChainNativeApi.decodeBlockRawTransaction(hexString);
//                 if(response.status != 200 || response.data.error) {
//                     this._showError(
//                         'fetch decoded block raw transaction',
//                         `Key: ${cacheKey}`,
//                         `decodeRaw`);
//                     return this._errorPayload();
//                 }
                
//                 data = response.data.result;
//                 if(data == undefined) { return this._errorPayload(); }
//                 this.cache.set(cacheKey, data);
//             }
    
//             return this._successPayload(data);
//         } catch (e) {
//             this._showError(
//                 'fetch decoded block raw transaction',
//                 `Key: ${cacheKey}`,
//                 `decodeRaw`);
//             return this._errorPayload();
//         }
//     }
    
//     // DONE
//     async getBalance(address: string): Promise<Object> {
//         const cacheKey = CacheKeys.AddressBalancePrefix + address;
//         const CACHE_EXP_ADDRESS_BALANCE = 5*60; //5 minutes
//         var data: any;

//         try {
//             data = await this.cache.get(cacheKey);
//             if(data == undefined) {
//                 const response: any = await ChainNativeApi.getAddressBalance([address]);
//                 if(response.status != 200 || response.data.error) {
//                     this._showError(
//                         'fetch address balance',
//                         `Address: ${address}`,
//                         `getBalance`);
//                     return this._errorPayload();
//                 }
                
//                 data = response.data.result;
//                 if(data == undefined) { return this._errorPayload(); }
//                 this.cache.set(cacheKey, data, CACHE_EXP_ADDRESS_BALANCE);
//             }

//             return this._successPayload(data);
//         } catch(e) {
//             this._showError(
//                 'fetch address balance',
//                 `Address: ${address}`,
//                 `getBalance`);
//             return this._errorPayload();
//         }
//     }

//     //DONE
//     async getStatus(): Promise<Object> {
//         const cacheKey = CacheKeys.BlockchainStatus;
//         const CACHE_EXP_BLOCKCHAIN_STATUS = 60; //60 seconds
//         var data: any;
//         try {
//             data = await this.cache.get(cacheKey);
//             if(data == undefined) {
//                 var requests = [
//                     this.getBlockchainInfo(),
//                     this.getMiningInfo(),
//                     this.getCoinSupplyInfo()
//                 ];

//                 const result: any = await Promise.all(requests);
//                 if(result.at(0)!.error 
//                     || result.at(1)!.error 
//                     || result.at(2)!.error) {
//                     this._showError(
//                         'fetch blockchain status',
//                         `Data: -`,
//                         `getStatus`);
//                     return this._errorPayload();
//                 }

//                 const r1 = result.at(0)!.data;
//                 const r2 = result.at(1)!.data;
//                 const r3 = result.at(2)!.data;
//                 data = {
//                     // R1
//                     'VRSCversion': 'v' + r1.VRSCversion,
//                     'protocolVersion': r1.protocolversion,
//                     'blocks': r1.blocks,
//                     'connections': r1.connections,
//                     'difficulty': r1.difficulty,
//                     'version': r1.version,
//                     //R2
//                     'networkHashrate': r2.networkhashps,
//                     // R3
//                     'circulatingSupply': r3.supply,
//                     'circulatingSupplyTotal': r3.total,
//                     'circulatingZSupply': r3.zfunds,
//                 };

//                 this.cache.set(cacheKey, data, CACHE_EXP_BLOCKCHAIN_STATUS);
//             }
//         } catch (e) {
//             console.log("STATUS >>>");
//             console.log(e);
//             this._showError(
//                 'fetch blockchain status',
//                 `Data: -`,
//                 `getStatus`);
//         }

//         return this._successPayload(data);
//     }

//     // DONE
//     async saveSummary(blockInfo: any): Promise<undefined | Object> {
//         try {
//             const blockHeight = blockInfo!.height;
//             const cacheKey = CacheKeys.BlockSummaryPrefix + blockHeight.toString();

//             var data: any = await this.cache.get(cacheKey);
//             if(data != undefined && data.height) { return data; }

//             data = {
//                 'anchor': blockInfo!.anchor,
//                 'bits': blockInfo!.bits,
//                 'blocktype': blockInfo!.blocktype,
//                 'difficulty': blockInfo!.difficulty,
//                 'hash': blockInfo!.hash,
//                 'height': blockInfo!.height,
//                 'nonce': blockInfo!.nonce,
//                 'previousblockhash': blockInfo!.previousblockhash,
//                 'size': blockInfo!.size,
//                 'segid': blockInfo!.segid,
//                 'time': blockInfo!.time,
//                 'version': blockInfo!.version,
//                 'txs': blockInfo!.tx,
//             }
//             this.cache.set(cacheKey, data);
//             return data;
//         } catch (e) {
//             this._showError(
//                 'save the block summary',
//                 `Error: ${e}`,
//                 `saveBlockSummary`); 
//             return undefined;
//         }
//     }

//     //DONE
//     async getSummary(blockHeight: number): Promise<undefined | Object> {
//         const cacheKey = CacheKeys.BlockSummaryPrefix + blockHeight.toString();
        
//         try {
//             var data: any = await this.cache.get(cacheKey);
//             if(data == undefined) {
//                 const blockInfo: any = await this.getInfo(blockHeight);
//                 if(blockInfo.error) {
//                     throw new Error("Error found while getting the block information.");
//                 }
//                 data = await this.saveSummary(blockInfo.data);
//                 if(data == undefined) {
//                     throw new Error("Error found while saving the block summary.");
//                 }
//             }
            
//             return data;
//         } catch (e) {
//             this._showError(
//                 'get the block summary',
//                 `Error: ${e}`,
//                 `getBlockSummary`); 
//             return undefined;
//         }
//     }

//     private _errorPayload(): ErrorPayload { return {
//         data: [],
//         error: true
//     }}
    
//     private _successPayload(data: any): SuccessPayload { 
//         return { data: data, error: false };
//     }

//     private _showError(data: string, value: string, method: string): void {
//         console.error(
//             `\n${(new Date()).toISOString()} :` +
//             `\nFailed to ${data}` +
//             `\n${value}` +
//             `\nMethod: ${method}` +
//             `\nOther operation will proceed.`
//         );
//     }

//     private _isDateWithinRange(rangeStart: number, rangeEnd: number, dateToTest: number) {
//         const start = (new Date(new Date(rangeStart)).toUTCString());
//         const end = (new Date(new Date(rangeEnd)).toUTCString());
//         const currentDate = (new Date(new Date(dateToTest)).toUTCString());
//         return currentDate <= start && currentDate >= end;
//     }
// }