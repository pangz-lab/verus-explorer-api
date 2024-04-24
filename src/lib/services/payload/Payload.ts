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
}


export class Payload {
    static _errorPayload(): ErrorPayload { return {
        data: [],
        error: true
    }}
    
    static _successPayload(data: any): SuccessPayload { 
        return { data: data, error: false };
    }

    static _showError(data: string, value: string, method: string): void {
        console.error(
            `\n${(new Date()).toISOString()} :` +
            `\nFailed to ${data}` +
            `\n${value}` +
            `\nMethod: ${method}` +
            `\nOther operation will proceed.`
        );
    }
}