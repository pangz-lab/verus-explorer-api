import 'dotenv/config';
import { VerusExplorerApi } from "./lib/VerusExploreApi";
import { HttpServer } from './lib/infra/network/HttpServer';
import { ZmqClient } from './lib/infra/network/ZmqClient';
import { WsServer } from './lib/infra/network/WsServer';
import { AppConfig } from './AppConfig';
import { Logger } from './lib/services/Logger';
import { Routes } from './lib/api/routes/Routes';

const startMessage = `

+++++++++++++++++++++++++++++++++++++++++++++++++
+           Starting VerusExplorerApi           +
+++++++++++++++++++++++++++++++++++++++++++++++++
`;
try {
    Logger.toDebugLog(startMessage).write();
    const conf = AppConfig.get();
    const wsServer = new WsServer();
    const httpServer = new HttpServer(
        conf.localServerPort,
        wsServer
    );

    const zmqClient = new ZmqClient(
        conf.zmq.host,
        conf.zmq.port,
        wsServer
    );

    const explorerApi = new VerusExplorerApi(zmqClient, httpServer);
    explorerApi.open();
    if(conf.ui.bind) {
        Routes.generateUI(
            httpServer!.serviceApp!,
            conf.ui.baseDir,
            conf.ui.routes
        );
    }

    process.on('exit', () => {
        explorerApi.close();
    });

} catch(e) {
    console.error(e);
}