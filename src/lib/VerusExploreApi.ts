import { ServerInterface } from "./models/ServerInterface";
import { HttpServer } from "./infra/network/HttpServer";
import { ZmqClient } from "./infra/network/ZmqClient";

export class VerusExplorerApi implements ServerInterface {
    private zmqClient?: ZmqClient;
    private httpServer?: HttpServer;

    constructor(zmqClient: ZmqClient, httpServer: HttpServer) {
        this.zmqClient = zmqClient;
        this.httpServer = httpServer;
    }

    open(): ServerInterface {
        this.httpServer!.open();
        this.zmqClient!.connect();
        return this;
    }

    close(): boolean {
        this.httpServer!.close();
        this.zmqClient!.disconnect();
        return true;
    }
}
