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
    private static kv: ConfigData;
    static set(kv: ConfigData): void {
        AppConfig.kv = kv;
    }

    static get(): ConfigData {
        if(AppConfig.kv == undefined) {
            throw new Error('Initialize the AppConfig class to get the configurations');
        }
        return AppConfig.kv;
    }
}