import { Redis } from "ioredis";
import { CachingServiceInterface } from '../../models/CachingServiceInterface';

export class RedisCaching 
implements CachingServiceInterface {
    private readonly host: string;
    private readonly port: number;
    private readonly namespace?: string;
    private client: any;
    
    constructor(host: string, port: number, namespace?: string) {
        this.host = host;
        this.port = port;
        this.namespace = namespace;
    }

    async connect(): Promise<void> {
        this.client = new Redis(this.port, this.host);
    }

    disconnect(): void { this.client.disconnect(); }

    async get(key: string): Promise<Object> {
        key = this._addNamespace(key);
        return await this.client.get(key);
    }

    async getAll(key: string): Promise<Object> {
        key = this._addNamespace(key);
        return await this.client.hgetall(key);
    }

    async set(key: string, value: string, expiryInSeconds?: number): Promise<void> {
        key = this._addNamespace(key);
        await this.client.set(key, value);
        if(expiryInSeconds != undefined && expiryInSeconds > 0) {
            await this.client.expire(key, expiryInSeconds);
        }
    }
    
    async delete(key: string): Promise<void> {
        key = this._addNamespace(key);
        await this.client.del(key);
    }
    
    async setKeyExpiry(key: string, expiryInSeconds?: number): Promise<void> {
        key = this._addNamespace(key);
        await this.client.expire(key, expiryInSeconds);
    }

    private _addNamespace(key: string) {
        if(this.namespace === null) { return key; }
        return this.namespace! + ':' + key;
    }
}
