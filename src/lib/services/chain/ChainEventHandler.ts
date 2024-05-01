import { EventData } from "verus-zmq-client";
import { LatestChainStatePayload } from "../payload/Payload";
import { BlockchainService as BlockchainService } from "./BlockchainService";

export class ChainEventHandler {
    static async onNewBlockAdded(value: EventData)
        : Promise<LatestChainStatePayload> {

        return BlockchainService.getCurrentState(value as string);
    }
}