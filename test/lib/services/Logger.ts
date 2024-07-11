import fs from 'node:fs';
import { Logger } from '../../../src/lib/services/Logger';
import { AppConfig, ConfigData } from '../../../src/AppConfig';

jest.mock('node:fs');
jest.mock('../../../src/AppConfig');

describe('Logger', () => {
    // const mockConfigData: ConfigData = {
    //     chain: 'test_chain',
    //     localServerPort: 8080,
    //     // chainNode: {
    //     //     walletId: 'test_wallet',
    //     //     address: 'test_address',
    //     //     authUser: 'test_user',
    //     //     authPw: 'test_pw',
    //     // },
    //     zmq: {
    //         host: 'test_zmq_host',
    //         port: 3000,
    //     },
    //     nodeApi: {
    //         host: 'test_api_host',
    //         authToken: 'test_api_token',
    //     },
    //     caching: {
    //         enabled: true,
    //         host: 'test_db_host',
    //         port: 27017,
    //     },
    //     logging: {
    //         enabled: true,
    //         errorLog: 'error.log',
    //         debugLog: 'debug.log'
    //     }
    // };

    beforeAll(() => {
        // (AppConfig.get as jest.Mock).mockReturnValue(mockConfigData);
    });

    // beforeEach(() => {
    //     jest.clearAllMocks();
    // });

    it('should create LogWriter for error log when enabled', () => {
        const content = 'Error message';
        console.log('LOGGINGGDGJKDJKDF');
        // console.log(AppConfig.get().logging);
        // AppConfig.set(mockConfigData);
        const writer = Logger.toErrorLog(content);
        expect(typeof writer).toBe('LogWriter');
        // expect(fs.appendFile).toHaveBeenCalledWith(mockConfigData.logging.errorLog, expect.any(String), expect.any(Function));
    });

    // it('should throw error if error log is not configured', () => {
    //     (AppConfig.get as jest.Mock).mockReturnValueOnce({
    //         ...mockConfigData,
    //         logging: { enabled: true }
    //     });
    //     const content = 'Error message';
    //     expect(() => Logger.toErrorLog(content)).toThrowError('Failed to log error.');
    // });

    // it('should create LogWriter for debug log when enabled', () => {
    //     const content = 'Debug message';
    //     Logger.toDebugLog(content);
    //     expect(fs.appendFile).toHaveBeenCalledWith(mockConfigData.logging.debugLog, expect.any(String), expect.any(Function));
    // });

    // it('should throw error if debug log is not configured', () => {
    //     (AppConfig.get as jest.Mock).mockReturnValueOnce({
    //         ...mockConfigData,
    //         logging: { enabled: false }
    //     });
    //     const content = 'Debug message';
    //     expect(() => Logger.toDebugLog(content)).toThrowError('Failed to log debug info.');
    // });
});
