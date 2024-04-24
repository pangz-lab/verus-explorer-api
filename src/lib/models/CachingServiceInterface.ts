export interface CachingServiceInterface {
    get(key: string): Object | Promise<Object>;
    getAll(key: string): Object | Promise<Object>;
    set(key: string, value: string): void;
    delete(key: string): void;
    connect?(): void;
    disconnect?(): void;
}