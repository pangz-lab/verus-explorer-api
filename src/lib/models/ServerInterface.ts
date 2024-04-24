export interface DuplexServer {
    receive(): void;
    send<T>(data: T): void;
}

export interface ServerInterface {
    open(): ServerInterface;
    close(): boolean;
}