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
import { PayloadCache } from "../../services/caching/Caching";
import { Payload, ServicePayload } from "../../services/payload/Payload";
import { CacheKeys } from "../../services/caching/CacheKeys";
import { Logger } from "../../services/Logger";


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
            Logger.toDebugLog("ZMQ Client connected to " + this.host! + ':' + this.port!).write();
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
            onHashBlockReceived: async function (value: EventData): Promise<Object> {
                Logger.toDebugLog("onHashBlockReceived >>" + value).write();
                setTimeout(async function() {
                    const cacheKey = CacheKeys.BlockchainStatus.key;
                    const ttl = CacheKeys.BlockchainStatus.ttl;

                    const data = await ChainEventHandler.onNewBlockAdded(value);
                    await PayloadCache.save<ServicePayload>({
                        source: async () => {
                            return (data === undefined)?
                                Payload.withError():
                                Payload.withSuccess(data);
                        },
                        onReturnUndefinedIf: (r) => r === undefined || (r != undefined && r.error),
                        key: cacheKey,
                        ttl: ttl
                    });

                    wss.send(data);

                }, 500);
                return {};
            }
        };
    }
}