import 'dotenv/config';
import { VerusExplorerApi } from "./lib/VerusExploreApi";
import { HttpServer } from './lib/infra/network/HttpServer';
import { ZmqClient } from './lib/infra/network/ZmqClient';
import { WsServer } from './lib/infra/network/WsServer';
import { AppConfig } from './AppConfig';

try {
    const conf = AppConfig.get();
    const wsServer = new WsServer();
    const httpServer = new HttpServer(conf.localServerPort, wsServer);

    const zmqClient = new ZmqClient(
        conf.zmq.host,
        conf.zmq.port,
        wsServer
    );

    const explorerApi = new VerusExplorerApi(zmqClient, httpServer);
    explorerApi.open();

    process.on('exit', () => {
        explorerApi.close();
    });

} catch(e) {
    console.error(e);
}