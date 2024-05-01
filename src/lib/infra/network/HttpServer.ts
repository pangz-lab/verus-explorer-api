import cors from 'cors';
import http from 'http';
import express, { Express } from 'express';
import { ServerInterface } from '../../models/ServerInterface';
import { WsServer } from './WsServer';
import helmet from 'helmet';

export class HttpServer implements ServerInterface {
    private expressApp?: Express;
    private port?: number;
    private wsServer?: WsServer;
    
    constructor(port: number, wsServer: WsServer) {
        this.port = port;
        this.wsServer = wsServer;
    }
    get routeApp(): Express | undefined { return this.expressApp; }

    close(): boolean {
        this.expressApp = undefined;
        return true;
    }

    open(): HttpServer {
        this.wsServer!.open();
        this.wsServer!.receive();
        
        this.expressApp = express();
        this.expressApp.use(helmet());
        this.expressApp!.use(express.json()) // for parsing application/json
        this.expressApp!.use(express.urlencoded({ extended: true }));
        this.expressApp!.use(cors({
            // origin: ['https://wip-api-insight.pangz.tech', 'http://localhost:2221'], // Add your allowed origins here
            // origin: ['https://wip-insight.pangz.tech', 'http://localhost:2220', 'http://localhost:2221', 'http://localhost:2223'], // Add your allowed origins here
            // origin: '*',
        }));
        // this.expressApp!.options('*', (req: Request, res: Response) => {
        //     // res.setHeader('Access-Control-Allow-Origin', '*');
        //     // res.setHeader('Access-Control-Allow-Origin', ['http://localhost:2220']);
        //     res.setHeader('Access-Control-Allow-Origin', ['http://localhost:2221']);
        //     // res.setHeader('Access-Control-Allow-Origin', );
        //     // next();
        // });
        
        const httpServer = this.expressApp.listen(this.port!);
        this.attachWsServerConnection(httpServer);
        return this;
    }

    private attachWsServerConnection(httpServer: http.Server): void {
        if(this.wsServer!.socket === undefined) {
            throw new Error("Websocket Server is not running.");
        }
        const wss = this.wsServer!.socket;

        httpServer.on('upgrade', (request, socket, head) => {
            const pathname = request.url;
            if (pathname === '/verus/wss') {
                wss.handleUpgrade(request, socket, head, function done(ws) {
                    ws.send("{data: 'connection established'}");
                });
            } else {
                socket.destroy();
            }
        });
    }
}