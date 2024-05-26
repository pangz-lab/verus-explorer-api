import { ServerInterface } from "./models/ServerInterface";
import { HttpServer } from "./infra/network/HttpServer";
import { ZmqClient } from "./infra/network/ZmqClient";
import { Routes } from "./api/routes/Routes";
import { Caching } from "./services/caching/Caching";

export class VerusExplorerApi implements ServerInterface {
    private zmqClient: ZmqClient;
    private httpServer: HttpServer;

    constructor(zmqClient: ZmqClient, httpServer: HttpServer) {
        this.zmqClient = zmqClient;
        this.httpServer = httpServer;
    }

    open(): ServerInterface {
        this.httpServer.open();
        this.zmqClient.connect();
        Routes.generate(this.httpServer!.serviceApp!);
        return this;
    }

    close(): boolean {
        this.zmqClient.disconnect();
        this.httpServer.close();
        Caching.disconnect();
        return true;
    }
}
