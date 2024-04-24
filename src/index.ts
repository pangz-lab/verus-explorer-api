import 'dotenv/config';
import { VerusExplorerApi } from "./lib/VerusExploreApi";
import { HttpServer } from './lib/infra/network/HttpServer';
import { ZmqClient } from './lib/infra/network/ZmqClient';
import { WsServer } from './lib/infra/network/WsServer';
import { Caching } from './lib/services/caching/Caching';
import { Routes } from './lib/routes/Routes';

const conf = process.env;
const wsServer = new WsServer();
const httpServer = new HttpServer(
    parseInt(conf.LOCAL_SERVER_PORT!),
    wsServer
);

const zmqClient = new ZmqClient(
    conf.NODE_ZMQ_ADDRESS!.toString(),
    parseInt(conf.NODE_ZMQ_PORT!),
    wsServer
);

const explorerApi = new VerusExplorerApi(
    zmqClient,
    httpServer,
);

explorerApi.open();
Routes.generate(httpServer.routeApp!);

process.on('exit', () => {
    console.log("Exiting >>>")
    explorerApi.close();
    Caching.disconnect();
});