'use strict'

// import express, { Express, Request, Response } from 'express';
// import WebSocket, { WebSocketServer } from 'ws';
import 'dotenv/config';

// import cors from 'cors';
import http from 'http';
import {
    EventData,
    SubscriptionEventsHandler,
    SubscriptionTopics,
    VerusZmqClient,
    VerusZmqConnection,
    VerusZmqOptions
} from 'verus-zmq-client';
import { VerusdRpcInterface } from 'verusd-rpc-ts-client';
import { ChainNativeApi } from './lib/services/chain/ChainNativeApi';
import { ChainApi } from './lib/services/chain/ChainApi';
import { RedisCaching } from './lib/infra/caching/RedisCaching';
// import { RpcRequestBody } from 'verusd-rpc-ts-client/lib/types/RpcRequest';


const conf = process.env;
const apiKeys = ["12345"];
// const expressApp: Express = express();
// expressApp.use(express.json()) // for parsing application/json
// expressApp.use(express.urlencoded({ extended: true }));

// expressApp.use(cors({
//     // origin: ['https://wip-api-insight.pangz.tech', 'http://localhost:2221'], // Add your allowed origins here
//     // origin: ['https://wip-insight.pangz.tech', 'http://localhost:2220', 'http://localhost:2221', 'http://localhost:2223'], // Add your allowed origins here
//     // origin: '*',
// }));
// expressApp.options('*', (req: Request, res: Response) => {
//     // res.setHeader('Access-Control-Allow-Origin', '*');
//     // res.setHeader('Access-Control-Allow-Origin', ['http://localhost:2220']);
//     res.setHeader('Access-Control-Allow-Origin', ['http://localhost:2221']);
//     // res.setHeader('Access-Control-Allow-Origin', );
//     // next();
// });


/**
 * const server = new VerusExplorerServer();
 * server.start();
 * 
 */


// WS Server 
// var mainWs: WebSocket;
// function onSocketError(err: any) {
//   console.error(err);
// }

// var wss: WebSocketServer;

// const wss = new WebSocketServer({
//     noServer: true,
//     perMessageDeflate: {
//         zlibDeflateOptions: {
//           // See zlib defaults.
//           chunkSize: 1024,
//           memLevel: 7,
//           level: 3
//         },
//         zlibInflateOptions: {
//           chunkSize: 10 * 1024
//         },
//         // Other options settable:
//         clientNoContextTakeover: true, // Defaults to negotiated value.
//         serverNoContextTakeover: true, // Defaults to negotiated value.
//         serverMaxWindowBits: 10, // Defaults to negotiated value.
//         // Below options specified as default values.
//         concurrencyLimit: 10, // Limits zlib concurrency for perf.
//         threshold: 1024 // Size (in bytes) below which messages
//         // should not be compressed if context takeover is disabled.
//     }
// });


// var zmqClient: VerusZmqClient;


// wss.on('close', function() {
//     clearInterval(connectionCheckerInterval);
// });

// wss.on('connection', (ws) => {
//     ws.on('error', console.error);
//     ws.on('message', (data) => {
//         // console.log(`>>>>>>>>>>>>>> ??? Received message ${data} from user ${req.remo}`);
//         console.log(`>>>>>>>>>>>>>> ??? Received message ${data} from user TODO`);
//     });

//     // ws.on('pong', heartbeat);
// });

// function runZmqClient(eh: SubscriptionEventsHandler) {
//     zmqClient = new VerusZmqClient(
//         new VerusZmqOptions(
//             new VerusZmqConnection(
//                 conf.NODE_ZMQ_ADDRESS!.toString(),
//                 parseInt(conf.NODE_ZMQ_PORT!)),
//             [
//                 SubscriptionTopics.hashBlock,
//                 // SubscriptionTopics.rawBlock,
//                 // SubscriptionTopics.sequence,
//                 // SubscriptionTopics.hashTx,
//                 // SubscriptionTopics.rawTx,
//             ],
//             eh
//         )
//     );

//     zmqClient
//         .connect()
//         .listen();
// }


// const eh: SubscriptionEventsHandler = {
//     onHashBlockReceived: function (value: EventData): Object {
//         console.log("onHashBlockReceived >> " + value);
//         return {res: 1};
//     },
//     onRawBlockReceived: function (value: EventData): Object {
//         console.log("onRawBlockReceived >> " + value);
//         return {res: 2};
//     },
//     onHashTxReceived: async function (value: EventData): Promise<Object> {
//         // console.log("onHashTxReceived >> " + value);
//         // const api = getExplorerApi();
//         // const resBody = await api.decodeBlockRawTransaction(value as string);
//         // const cacheData = api.saveBlockSummary(resBody);
//         // console.log(" HASH TX >>>");
//         // console.log(resBody);
//         // console.log(" HASH TX END >>>");
//         // const payload = {
//         //     "rawData": 'Zmq Data: >>> ' + value,
//         //     "status": resBody,
//         // };
//         // console.log("onHashTxReceived>> ");
//         return {
//             data: value,
//             error: false
//         };
//     },
//     onRawTxReceived: async function (value: EventData): Promise<Object> {
//         // console.log("onRawTxReceived >> " + value);
//         // const api = getExplorerApi();
        
//         // console.log("creating SUMMARYY START >>> >>>")
//         // var cacheData: any;
//         // var decodedRawTx: any = await api.decodeBlockRawTransaction(value as string);
//         // console.log(decodedRawTx);
//         // if(decodedRawTx.error || !decodedRawTx.data.txid) { return errorData; }
        
//         // const txInfo: any = await api.getTransactionInfo(decodedRawTx.data.txid);
//         // console.log(txInfo);
//         // if(txInfo.error || !txInfo.data.height) { return errorData; }

//         // const txHeight: number = txInfo.data.height;
        
        

//         // const payload = {
//         //     "rawData": 'Zmq Data: >>> ' + value,
//         //     "status": resBody,
//         // };
//         // console.log("onHashTxReceived>> ");
//         return {
//             data: value,
//             error: false
//         };
//     },
//     // onSequenceReceived: function (value: EventData): Object {
//     //     console.log("onSequenceReceived >> " + value);
//     //     return {res: 4};
//     // },
//     // before: function(value: EventData, topic?: string) {
//     //     console.log(`before value >> ${value} ${topic}`);
//     //     return {};
//     // },
//     after: async function(value: EventData, topic?: string) {
//         var timeout: NodeJS.Timeout;
//         timeout = setTimeout(async function() {
//             await processZmqData(value, topic);
//             clearTimeout(timeout);
//         }, 500);
//     }
// };


// var lastProcessedHeight: number = 0;
// const MAX_RETRY = 3;
// async function processZmqData(value: EventData, topic?: string) {
//     const api = getExplorerApi();
//     var blockInfoSummary: any = { "blocks": [] };
//     var payload: any = {};

//     // const chainHeightResult: any = await api.getBlockchainHeight();
//     // if(chainHeightResult.error || !chainHeightResult.data) {
//     //     sendDataToWsClients({[topic as string]: value});
//     //     return;
//     // }
    
//     // const chainHeight: number = chainHeightResult.data;
//     // if(lastProcessedHeight >= chainHeight) {
//     //     sendDataToWsClients({[topic as string]: value});
//     //     return;
//     // }

//     const blockInfo: any = await api.getBlockInfo(value as string);
//     if(blockInfo.error || !blockInfo.data) {
//         sendDataToWsClients({[topic as string]: value});
//         return;
//     }

//     const chainHeight: number = blockInfo.data.height;
//     if(lastProcessedHeight >= chainHeight) {
//         sendDataToWsClients({[topic as string]: value});
//         return;
//     }

    
//     if(lastProcessedHeight < chainHeight) {
//         // if(lastProcessedHeight === 0) { lastProcessedHeight = chainHeight - 1; }
//         // var retryCounter = 0;
//         // if(lastProcessedHeight === 0) { lastProcessedHeight = chainHeight; }
//         var blockTxs: string[] = [];
//         // blockInfo: any = await api.getBlockInfo(lastProcessedHeight);

//         // for(var height = lastProcessedHeight; height <= chainHeight; height++) {
//         //     var blockInfo: any = await api.getBlockInfo(height);
//         //     retryCounter = 0;
//         //     while(blockInfo.error && retryCounter < MAX_RETRY) {
//         //         blockInfo = await api.getBlockInfo(height);
//         //         retryCounter += 1;
//         //     }
//         //     if(blockInfo.error) { continue; }
            
//         //     const summary: any = await api.saveBlockSummary(blockInfo.data);
//         //     if(summary == undefined) { continue; }
//         //     blockInfoSummary["blocks"].push(summary);
//         //     summary.txs.map((e: string) => {
//         //         if(!blockTxs.includes(e)) { blockTxs.unshift(e); }
//         //     });
//         //     lastProcessedHeight = height;
//         // }

//         const summary: any = await api.saveBlockSummary(blockInfo.data);
//         if(summary === undefined) {
//             sendDataToWsClients({[topic as string]: value});
//             return;
//         }

//         blockInfoSummary["blocks"].push(summary);
//         summary.txs.map((e: string) => {
//             if(!blockTxs.includes(e)) { blockTxs.unshift(e); }
//         });
//         lastProcessedHeight = chainHeight;

//         var txsInfo = [];
//         var retryCounter = 0;
//         for(var index = 0; index < blockTxs.length; index++) {
//             var txInfo: any = await api.getTransactionInfo((blockTxs.at(index) as string));
//             retryCounter = 0;
//             console.log(chainHeight + ' ' + blockTxs.at(index));
//             while(txInfo.error && retryCounter < MAX_RETRY) {
//                 txInfo = await api.getTransactionInfo((blockTxs.at(index) as string));
//                 retryCounter += 1;
//             }
//             if(txInfo.error) { continue; }
//             const d = txInfo.data;
//             txsInfo.push({
//                 txid: d.txid,
//                 vout: d.vout,
//                 time: d.time,
//                 height: d.height,
//                 blockhash: d.blockhash,
//             });
//         }
        
//         blockInfoSummary = { data: blockInfoSummary, error: false };
//         const latestTxs = { data: txsInfo, error: false };
//         const blockchainStatus = await api.getBlockchainStatus();
//         payload = {
//             "status": blockchainStatus,
//             "latestBlocks": blockInfoSummary,
//             "latestTxs": latestTxs,
//         };
//         sendDataToWsClients(payload);
//     }
// }

// Send data to ws clients 
// function sendDataToWsClients(payload: any) {
//     var clientsCount = 0;
//     var dcClientsCount = 0;
//     wss.clients.forEach(function each(client) {
//         // if (client !== ws && client.readyState === WebSocket.OPEN) {
//             // client.send(value, { binary: isBinary });
//             if (client.readyState === WebSocket.OPEN) {
//                 // client.send(data, { binary: isBinary });
//                 clientsCount += 1;
//                 client.send(JSON.stringify(payload));
//             } else {
//                 dcClientsCount += 1;
//                 client.close();
//             }
//         // }
//     });
// }

// check for close connection

// const connectionCheckerInterval = setInterval(function() {
//     wss.clients.forEach(function each(ws) {
//         if (ws.readyState !== WebSocket.OPEN) {
//             console.log("Connection is closed. CLOSING ....");
//             return ws.terminate();
//         }
  
//         //   ws.isAlive = false;
//         // ws.ping();
//     });
// }, 30000);

// function closeAllWsConnections() {
//     wss.clients.forEach(function each(client) { client.close();});
// }

var explorerManager: ChainNativeApi;
var explorerApi: ChainApi;
const redisClient = new RedisCaching(
    conf.DFLY_DB_HOST!.toString(),
    parseInt(conf.DFLY_DB_PORT!),
    conf.CHAIN_SOURCE!.toString()
);
redisClient.connect();

function getExplorerApi(): ChainApi {
    if(explorerApi == undefined) {
        explorerApi = new ChainApi(
            getApiManager(),
            redisClient
        );
    }
    return explorerApi;
}

// function getApiManager(): VerusNativeApi {
//     if(explorerManager == undefined) {
//         explorerManager = new VerusNativeApi(new VerusdRpcInterface(
//             conf.NODE_WALLET_ID!.toString(),
//             conf.NODE_ADDRESS!.toString(),
//             {
//                 auth: {
//                     username: conf.NODE_AUTH_USER!.toString(),
//                     password: conf.NODE_AUTH_PW!.toString(),
//                 },
//             }
//         ));
//     }
//     return explorerManager;
// }

// Explore API
/*
expressApp.post('/', async (req: Request, res: Response) => {
    const key: string | undefined = req.headers['x-api-key']?.toString();

    // console.log(req.headers);
    // const body = req.body as RpcRequestBody;
    const body = req.body
    console.log(req.body);

    // key isn't present
    if (!key) return res.status(400).send('api key required');

    // key is invalid
    if (!apiKeys.includes(key)) return res.status(401).send('invalid api key');

    console.log("BODY >>>");
    console.log(body);
    const manager = getApiManager();
    const rawMethodName = manager.methodMap.get(body.method);

    // console.log(rawMethodName);
    const methodName = Reflect.get(manager, (rawMethodName)? rawMethodName : "") as Function;
    const resBody = await Reflect.apply(methodName, manager, [body.params]);
    
    // console.log(resBody);
    // res.setHeader('Access-Control-Allow-Origin', '*');

    // If process thru the VerusD class or an external API
    res.send((resBody.data) ? resBody.data : resBody);
    // res.send("Hello1");
    // res.send({data: "helloworld"});
    // res.send("Hello2");
});
*/

// expressApp.post('/api/blocks/generated', async (req: Request, res: Response) => {
//     // req.setMaxListeners(30);
//     const body = req.body as RpcRequestBody;
//     const api = getExplorerApi();
//     const resBody = await api.getGeneratedBlocks(body.params! as string[]);
//     res.send(resBody);
// });

// expressApp.post('/api/block/hashes', async (req: Request, res: Response) => {
//     // req.setMaxListeners(30);
//     const body = req.body as RpcRequestBody;
//     const api = getExplorerApi();
//     const resBody = await api.getBlockHashesByRange(
//         body.params![0] as number,
//         body.params![1] as number
//     );
//     res.send(resBody);
// });

// expressApp.post('/api/block/info', async (req: Request, res: Response) => {
//     // req.setMaxListeners(30);
//     const body = req.body as RpcRequestBody;
//     const api = getExplorerApi();
//     const resBody = await api.getBlockInfo(body.params![0]! as string);
//     res.send(resBody);
// });

// expressApp.get('/api/blockchain/mining/info', async (req: Request, res: Response) => {
//     // req.setMaxListeners(30);
//     const api = getExplorerApi();
//     const resBody = await api.getMiningInfo();
//     res.send(resBody);
// });

// expressApp.get('/api/blockchain/info', async (req: Request, res: Response) => {
//     // req.setMaxListeners(30);
//     const api = getExplorerApi();
//     const resBody = await api.getBlockchainInfo();
//     res.send(resBody);
// });

// // expressApp.post('/api/blockchain/info/decode', async (req: Request, res: Response) => {
// //     // req.setMaxListeners(30);
// //     const body = req.body as RpcRequestBody;
// //     const api = getExplorerApi();
// //     const resBody = await api.decodeBlockRawTransaction(body.params![0] as string);
// //     res.send(resBody);
// // });

// expressApp.get('/api/blockchain/height', async (req: Request, res: Response) => {
//     // req.setMaxListeners(30);
//     const api = getExplorerApi();
//     const resBody = await api.getBlockchainHeight();
//     res.send(resBody);
// });

// expressApp.get('/api/blockchain/status', async (req: Request, res: Response) => {
//     const api = getExplorerApi();
//     const resBody = await api.getBlockchainStatus();
//     res.send(resBody);
// });


// expressApp.post('/api/transaction/info', async (req: Request, res: Response) => {
//     // req.setMaxListeners(30);
//     const body = req.body as RpcRequestBody;
//     const api = getExplorerApi();
//     const resBody = await api.getTransactionInfo(body.params![0] as string);
//     res.send(resBody);
// });

// expressApp.post('/api/identity/info', async (req: Request, res: Response) => {
//     // req.setMaxListeners(30);
//     const body = req.body as RpcRequestBody;
//     const api = getExplorerApi();
//     const height = body.params![1]! != undefined? parseInt(body.params![1]!.toString()) : undefined;
//     const resBody = await api.getIdentityInfo(body.params![0]!.toString(),height);
//     res.send(resBody);
// });

// expressApp.post('/api/address/txids', async (req: Request, res: Response) => {
//     // req.setMaxListeners(30);
//     const body = req.body as RpcRequestBody;
//     const api = getExplorerApi();
//     const resBody = await api.getAddressTxIds(
//         body.params![0]!.toString()
//     );
//     res.send(resBody);
// });

// expressApp.post('/api/address/balance', async (req: Request, res: Response) => {
//     // req.setMaxListeners(30);
//     const body = req.body as RpcRequestBody;
//     const api = getExplorerApi();
//     const resBody = await api.getAddressBalance(
//         body.params![0]!.toString()
//         );
//     res.send(resBody);
// });


// Both http server and express
// const httpServer = http.createServer(expressApp); // ws with express
// const httpServer = http.createServer(expressApp);
// httpServer.setMaxListeners(50);
// expressApp.setMaxListeners(50);
// httpServer.listen(conf.LOCAL_SERVER_PORT);
// httpServer.listen(conf.LOCAL_SERVER_PORT);
runZmqClient(eh);
console.log("Express is listening to port: " + conf.LOCAL_SERVER_PORT);
console.log("WS server is listening to port: " + conf.LOCAL_SERVER_PORT);
console.log("ZMQ is listening to port: " + conf.NODE_ZMQ_PORT);
console.log("Connecting to DflyDB using port: " + conf.DFLY_DB_PORT);


// httpServer.on('upgrade', function upgrade(request, socket, head) {
//     socket.on('error', onSocketError);

//         // This function is not defined on purpose. Implement it with your own logic.
//         //   authenticate(request, function next(err, client) {
//         //     if (err || !client) {
//         //       socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
//         //       socket.destroy();
//         //       return;
//         //     }

//         //     socket.removeListener('error', onSocketError);

//         //     wss.handleUpgrade(request, socket, head, function done(ws) {
//         //       wss.emit('connection', ws, request, client);
//         //     });
//         //   });
//         const pathname = request.url;
//         if (pathname === '/verus/wss') {
//             // wss.handleUpgrade(request, socket, head, (ws) => {
//             //     wss.emit('connection', ws, request);
//             // });
//             wss.handleUpgrade(request, socket, head, function done(ws) {
//                 // wss.emit('connection', ws, request, client);
//                 // mainWs = ws;
//                 ws.send('connection established');
//             });
//         } else {
//             socket.destroy();
//         }
//         /*
//     wss.handleUpgrade(request, socket, head, function done(ws) {
//         // wss.emit('connection', ws, request, client);
//         // mainWs = ws;
//         ws.send('connection established');
//     });
//     */
// });

process.on('exit', () => {
    console.log("<<<<< Closing all connections >>>>>")
    redisClient.disconnect();
    zmqClient.disconnect();
    closeAllWsConnections();
    wss.close();
    httpServer.close();
});


// // temporary 
// setInterval(() =>{

//     console.log(" getting eventNames() >>");
//     // console.log(httpServer.eventNames());
//     // console.log(util.inspect(httpServer.listeners('request')));
//     // console.log(util.inspect(httpServer.listeners('connection')));
    
    
//     // console.log(httpServer.listenerCount('connection'));
//     // console.log(httpServer.listenerCount('request'));
//     // console.log(httpServer.listenerCount('mount'));
//     // console.log(httpServer.listeners.name);
//     // console.log(httpServer.listeners.length);

//     // console.log(expressApp.listenerCount());
// }, 2000);

/*
const apiServer = new VerusExplorerApiServer({
    wsServer: {
        host: 'localhost',
        endpoint: 'verus/wss',
        port: 1221
    },
    zmqServer: {
        host: 'localhost',
        port: 22121
    },
    authorizedKeys: function() {
        return []
    },
    allowedOrigins: function() {

    }
});
apiServer.run();
apiServer.exit();
*/