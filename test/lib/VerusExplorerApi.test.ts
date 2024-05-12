import { VerusExplorerApi } from '../../src/lib/VerusExploreApi';
import { ServerInterface } from '../../src/lib/models/ServerInterface';
import { HttpServer } from '../../src/lib/infra/network/HttpServer';
import { ZmqClient } from '../../src/lib/infra/network/ZmqClient';
import { Routes } from '../../src/lib/api/routes/Routes';
import { Caching } from '../../src/lib/services/caching/Caching';
import { WsServer } from '../../src/lib/infra/network/WsServer';

jest.mock('../../src/lib/infra/network/HttpServer');
jest.mock('../../src/lib/infra/network/ZmqClient');
jest.mock('../../src/lib/api/routes/Routes');
jest.mock('../../src/lib/services/caching/Caching');

describe('VerusExplorerApi', () => {
    let wsServer: WsServer;
    let httpServer: HttpServer;
    let zmqClient: ZmqClient;
    let verusExplorerApi: ServerInterface;

    beforeEach(() => {
        wsServer = new WsServer();
        httpServer = new HttpServer(1111, wsServer);
        zmqClient = new ZmqClient('localhost', 2222, wsServer);
        verusExplorerApi = new VerusExplorerApi(zmqClient, httpServer);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should open http server and connect zmq client on open', () => {
        verusExplorerApi.open();
        expect(httpServer.open).toHaveBeenCalledTimes(1);
        expect(zmqClient.connect).toHaveBeenCalledTimes(1);
        expect(Routes.generate).toHaveBeenCalledTimes(1);
    });

    it('should close http server, disconnect zmq client, and disconnect caching on close', () => {
        const result = verusExplorerApi.close();
        expect(zmqClient.disconnect).toHaveBeenCalledTimes(1);
        expect(httpServer.close).toHaveBeenCalledTimes(1);
        expect(Caching.disconnect).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });
});
