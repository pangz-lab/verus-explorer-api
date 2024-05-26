import 'dotenv/config';
export type ConfigData = {
    chain: string,
    localServerPort: number,
    ui: {
        bind: boolean,
        baseDir: string,
        routes: string[],
    },
    chainNode: {
        walletId: string,
        address: string,
        authUser: string,
        authPw: string,
    },
    zmq: {
        host: string,
        port: number,
    },
    nodeApi: {
        host: string,
        authToken: string,
    },
    caching: {
        enabled: boolean,
        host: string,
        port: number,
    }
    logging: {
        enabled: boolean
        errorLog: string
        debugLog: string
    }
}

export class AppConfig {
    private static kv: ConfigData = {
        chain: process.env.CHAIN_SOURCE!,
        localServerPort: parseInt(process.env.LOCAL_SERVER_PORT!),
        ui: { 
            bind: process.env.BIND_UI! == "true" ?? false,
            baseDir: process.env.UI_BASE_DIR!,
            routes: process.env.UI_ROUTES!.split(','),
        },
        chainNode: {
            walletId: process.env.NODE_WALLET_ID!,
            address: process.env.NODE_ADDRESS!,
            authUser: process.env.NODE_AUTH_USER!,
            authPw: process.env.NODE_AUTH_PW!,
        },
        zmq: {
            host: process.env.NODE_ZMQ_ADDRESS!,
            port: parseInt(process.env.NODE_ZMQ_PORT!),
        },
        nodeApi: {
            host: process.env.EXT_API_HOST!,
            authToken: process.env.EXT_API_AUTH_TOKEN!,
        },
        caching: {
            enabled: process.env.USE_CACHING! == "true" ?? false,
            host: process.env.DFLY_DB_HOST!,
            port: parseInt(process.env.DFLY_DB_PORT!),
        },
        logging: {
            enabled: process.env.ENABLE_LOGGING! == "true" ?? false,
            errorLog: process.env.ERROR_LOG!,
            debugLog: process.env.DEBUG_LOG!
        }
    };

    static set(kv: ConfigData): void {
        AppConfig.kv = kv;
    }

    static get(): ConfigData {
        if(AppConfig.kv === undefined) {
            throw new Error('Initialize the AppConfig class to get the configurations');
        }
        return AppConfig.kv;
    }
}