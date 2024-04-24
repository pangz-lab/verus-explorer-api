import { Logger } from "../Logger";

export type ServicePayload = undefined | SuccessPayload | ErrorPayload;
export type SuccessPayload = {
    data: Object, 
    error: false
} 

export type ErrorPayload = {
    data: [], 
    error: true
}

export type LatestChainStatePayload = {
    status?: Object,
    latestBlocks?: Object,
    latestTxs?: Object,
    nodeState?: Object,
}

export class Payload {
    static withError(): ErrorPayload { return {
        data: [],
        error: true
    }}
    
    static withSuccess(data: any): SuccessPayload { 
        return { data: data, error: false };
    }

    static logError(data: string, value: string, method: string): void {
        Logger.toErrorLog(
            `\n${(new Date()).toISOString()} :` +
            `\nFailed to ${data}` +
            `\n${value}` +
            `\nMethod: ${method}` +
            `\nOther operation will still continue.`
        );
    }
}