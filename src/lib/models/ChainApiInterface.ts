// export interface ChainApiInterface {

//     // function getInfo() {
//     //     return sendRequest(createPayload("getinfo", []));
//     // };
//     getInfo(): Object;
      
//     //   function getMiningInfo() {
//     //     return sendRequest(createPayload("getmininginfo", []));
//     //   };
//     getMiningInfo(): Object;
      
//     //   function getCoinSupply() {
//     //     return sendRequest(createPayload("coinsupply", []));
//     //   };
//     getCoinSupply(): Object;
  
//     //   function getRawTransaction(txId) {
//     //     return sendRequest(createPayload("getrawtransaction", [txId, 1]));
//     //   };
//     getRawTransaction(heightOrTx: string): Object;
    
//     decodeBlockRawTransaction(hexString: string): Object;
      
//     //   function getBlockDetail(heightOrTx) {
//     //     return sendRequest(createPayload("getblock", [heightOrTx]));
//     //   };
//     getBlockDetail(heightOrHash: string | number): Object;
      
//     //   function getBlockDetailByTx(tx) {
//     //     return getBlockDetail(tx);
//     //   };
//     // getBlockDetailByTx(tx: string): Object;
      
//     //   function getBlockDetailByHeight(height) {
//     //     return getBlockDetail(height);
//     //   };
//     // getBlockDetailByHeight(tx: string): Object;
  
//     //   function getBlockCount() {
//     //     return sendRequest(createPayload("getblockcount", []));
//     //   };
//     getBlockCount(): Object;
      
//     //   function getIdentity(params) {
//     //     return sendRequest(createPayload("getidentity", params));
//     //   };
//     getIdentity(identityName: string, height?: number): Object;
      
//     //   function getAddressTxIds(addresses) {
//     //     return sendRequest(createPayload("getaddresstxids", [{"addresses": addresses}]));
//     //   };
//     getAddressTxIds(addresses: string[]): Object;
    
//     //   function getAddressBalance(addresses) {
//     //     return sendRequest(createPayload("getaddressbalance", [{"addresses": addresses}]));
//     //   };
//     getAddressBalance(addresses: string[]): Object;

//     //   function getBlockHashes(startDatetime, endDatetime) {
//     //     return sendRequest(createPayload("getblockhashes", [startDatetime, endDatetime]));
//     //   };
//     getBlockHashes(dateTime: string[]): Object;
// }