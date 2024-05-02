import { AppConfig } from "../../../AppConfig";
import { RedisCaching } from "../../infra/caching/RedisCaching";
import { CachingServiceInterface } from "../../models/CachingServiceInterface";

type GetParams<T> = {
    source: Function,
    onReturnUndefinedIf: OnErrorCheck<T>,
    key: string,
    ttl: number,
    useCache?: boolean
}
type OnErrorCheck<T> = (sourceResult: T) => boolean;

export class Caching {
    private static instance?: CachingServiceInterface;
    private static enable?: boolean;

    private static isEnabled(): boolean {
        if(Caching.enable === undefined)  {
            Caching.enable = AppConfig.get().caching.enabled;
        }
        return Caching.enable;
    }

    private static getInstance(): CachingServiceInterface {
        if(Caching.instance === undefined) {
            try {
                Caching.instance = new RedisCaching(
                    AppConfig.get().caching.host,
                    AppConfig.get().caching.port,
                    AppConfig.get().chainSource
                );
                (Caching.instance as RedisCaching).connect()!;
            } catch (e) {
                throw new Error("Caching service is unavailable! Check the connection and try again.");
            }
        }
        return Caching.instance;
    }

    static disconnect(): void {
        if(Caching.instance === undefined) { return; }
        (Caching.instance as RedisCaching).disconnect()!;
    }

    static set(key: string, value: any, expiry?: number): void {
        if(!Caching.isEnabled()) { return; }
        (Caching.getInstance() as RedisCaching).set(key, JSON.stringify(value), expiry);
    }

    static async get<T>(key: string): Promise<undefined | T> {
        try {
            if(!Caching.isEnabled()) { return; }
            const d = JSON.parse(await (Caching.getInstance() as RedisCaching).get(key) as string);
            return (d == null)? undefined : d;
        } catch (_) {
            return undefined;
        }
    }
}

export class PayloadCache {
    static async get<T>(p: GetParams<T>): Promise<T | undefined> {
        if(p.useCache != undefined && !p.useCache) {
            return await p.source();
        }

        var resBody = await Caching.get<T>(p.key);
        if(resBody === undefined) {
            resBody = await p.source();
            if(p.onReturnUndefinedIf(resBody as T)) { return undefined; }
            Caching.set(p.key, resBody, p.ttl);
        }
        return resBody;
    }
    
    static async save<T>(p: GetParams<T>): Promise<T | undefined> {
        const result = await p.source();
        if(p.onReturnUndefinedIf(result as T)) { return undefined; }
        Caching.set(p.key, result, p.ttl);
    }
}