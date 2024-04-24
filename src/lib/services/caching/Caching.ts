import { RedisCaching } from "../../infra/caching/RedisCaching";
import { CachingServiceInterface } from "../../models/CachingServiceInterface";

export class Caching {
    private static instance?: CachingServiceInterface;
    private static enable?: boolean;

    private static isEnabled(): boolean {
        if(Caching.enable === undefined)  {
            Caching.enable = (process.env.USE_CACHING?.toString() == 'true') ?? false
        }
        return Caching.enable;
    }

    private static getInstance(): CachingServiceInterface {
        if(Caching.instance === undefined) {
            try {
                const conf = process.env;
                Caching.instance = new RedisCaching(
                    conf.DFLY_DB_HOST!.toString(),
                    parseInt(conf.DFLY_DB_PORT!),
                    conf.CHAIN_SOURCE!.toString()
                );
                (Caching.instance as RedisCaching).connect()!;
            } catch (e) {
                throw new Error("Caching service is unavailable! Check connecting and try again.");
            }
        }
        return Caching.instance;
    }

    static disconnect(): void {
        if(Caching.instance == undefined) { return; }
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