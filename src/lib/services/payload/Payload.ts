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

export type LatestChainStatePayload = undefined | {
    status?: Object,
    latestBlock?: Object,
    latestTxs?: Object,
    nodeState?: Object,
}

export class Payload {
    static withError(value?: any): ErrorPayload { return {
        data: value ?? [],
        error: true
    }}
    
    static withSuccess<T>(data: T | any): SuccessPayload { 
        return { data: data, error: false };
    }

    static logError(data: string, value: string, method: string): void {
        Logger.toErrorLog(
            `\n${(new Date()).toISOString()} :` +
            `\nFailed to ${data}` +
            `\n${value}` +
            `\nMethod: ${method}` +
            `\nOther operation will still continue.`
        ).write();
    }
}