import 'dotenv/config';
import { VerusExplorerApi } from "./lib/VerusExploreApi";
import { HttpServer } from './lib/infra/network/HttpServer';
import { ZmqClient } from './lib/infra/network/ZmqClient';
import { WsServer } from './lib/infra/network/WsServer';
import { AppConfig } from './lib/services/AppConfig';

try {
    const conf = process.env;
    AppConfig.set({
        chainSource: conf.CHAIN_SOURCE!,
        localServerPort: parseInt(conf.LOCAL_SERVER_PORT!),
        chainNode: {
            walletId: conf.NODE_WALLET_ID!,
            address: conf.NODE_ADDRESS!,
            authUser: conf.NODE_AUTH_USER!,
            authPw: conf.NODE_AUTH_PW!,
        },
        zmq: {
            host: conf.NODE_ZMQ_ADDRESS!,
            port: parseInt(conf.NODE_ZMQ_PORT!),
        },
        nodeApi: {
            host: conf.EXT_API_HOST!,
            authToken: conf.EXT_API_AUTH_TOKEN!,
        },
        useCaching: conf.USE_CACHING! == "true" ?? false,
        logging: {
            errorLog: conf.ERROR_LOG!
        }
    })

    const config = AppConfig.get()
    const wsServer = new WsServer();
    const httpServer = new HttpServer(config.localServerPort, wsServer);

    const zmqClient = new ZmqClient(
        config.zmq.host,
        config.zmq.port,
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