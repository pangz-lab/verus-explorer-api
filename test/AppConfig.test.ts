import { AppConfig, ConfigData } from '../src/AppConfig';

describe('AppConfig', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeAll(() => {
        originalEnv = { ...process.env };
        process.env.CHAIN_SOURCE = 'test_chain';
        process.env.LOCAL_SERVER_PORT = '8080';
        process.env.NODE_WALLET_ID = 'test_wallet';
        process.env.NODE_ADDRESS = 'test_address';
        process.env.NODE_AUTH_USER = 'test_user';
        process.env.NODE_AUTH_PW = 'test_pw';
        process.env.NODE_ZMQ_ADDRESS = 'test_zmq_host';
        process.env.NODE_ZMQ_PORT = '3000';
        process.env.EXT_API_HOST = 'test_api_host';
        process.env.EXT_API_AUTH_TOKEN = 'test_api_token';
        process.env.USE_CACHING = 'true';
        process.env.DFLY_DB_HOST = 'test_db_host';
        process.env.DFLY_DB_PORT = '27017';
        process.env.ENABLE_LOGGING = 'true';
        process.env.ERROR_LOG = 'error.log';
        process.env.DEBUG_LOG = 'debug.log';
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should return the correct configuration', () => {
        const expectedConfig: ConfigData = {
            chain: 'test_chain',
            localServerPort: 8080,
            chainNode: {
                walletId: 'test_wallet',
                address: 'test_address',
                authUser: 'test_user',
                authPw: 'test_pw',
            },
            zmq: {
                host: 'test_zmq_host',
                port: 3000,
            },
            nodeApi: {
                host: 'test_api_host',
                authToken: 'test_api_token',
            },
            caching: {
                enabled: true,
                host: 'test_db_host',
                port: 27017,
            },
            logging: {
                enabled: true,
                errorLog: 'error.log',
                debugLog: 'debug.log'
            }
        };
        AppConfig.set(expectedConfig);
        expect(AppConfig.get()).toEqual(expectedConfig);
    });
});
