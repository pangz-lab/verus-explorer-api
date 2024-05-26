import { EventData } from "verus-zmq-client";
import { LatestChainStatePayload } from "../../services/Payload";
import { BlockchainDataProvider } from "../chain/BlockchainDataProvider";

export class ChainEventHandler {
    static async onNewBlockAdded(value: EventData)
        : Promise<LatestChainStatePayload> {

        return BlockchainDataProvider.getCurrentState(value as string);
    }
}