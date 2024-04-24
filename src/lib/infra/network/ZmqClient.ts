import {
    EventData,
    SubscriptionEventsHandler,
    SubscriptionTopics,
    VerusZmqClient,
    VerusZmqConnection,
    VerusZmqOptions
} from "verus-zmq-client";
import { WsServer } from "./WsServer";
import { ChainEventHandler } from "../../services/chain/ChainEventHandler";


export class ZmqClient {
    private client?: VerusZmqClient;
    private wsServer?: WsServer;
    private host?: string;
    private port?: number;
    private eventHandler?: SubscriptionEventsHandler;

    constructor(
        host: string,
        port: number,
        wsServer: WsServer,
        eventHandler?: SubscriptionEventsHandler
    ) {
        this.host = host;
        this.port = port;
        this.wsServer = wsServer;
        this.eventHandler = (eventHandler == null)? 
            this.getDefaultEventHandler() :
            eventHandler
    }

    connect(): void {
        try {
            this.client = new VerusZmqClient(
                new VerusZmqOptions(
                    new VerusZmqConnection(this.host!, this.port!),
                    [ SubscriptionTopics.hashBlock ],
                    this.eventHandler!
                )
            );
            
            this.client!
                .connect()
                .listen();
        } catch (e) {
            throw new Error("An error occurred while initializing the ZMQ Client.");
        }
    }

    disconnect(): void {
        this.client!.disconnect();
    }

    private getDefaultEventHandler(): SubscriptionEventsHandler {
        const wss = this.wsServer!;
        return {
            onHashBlockReceived: function (_value: EventData): Object {
                console.log("onHashBlockReceived >>" + _value);
                return {};
            },
            after: async function(value: EventData, topic?: string) {
                wss.send(await ChainEventHandler.onNewBlockAdded(value, topic));
            }
        };
    }
}