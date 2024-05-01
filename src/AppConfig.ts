import 'dotenv/config';
export type ConfigData = {
    chainSource: string,
    localServerPort: number,
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
    useCaching: boolean,
    logging: {
        errorLog: string
    }
}

export class AppConfig {
    private static kv: ConfigData = {
        chainSource: process.env.CHAIN_SOURCE!,
        localServerPort: parseInt(process.env.LOCAL_SERVER_PORT!),
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
        useCaching: process.env.USE_CACHING! == "true" ?? false,
        logging: {
            errorLog: process.env.ERROR_LOG!
        }
    };

    static get(): ConfigData {
        if(AppConfig.kv === undefined) {
            throw new Error('Initialize the AppConfig class to get the configurations');
        }
        return AppConfig.kv;
    }
}