import cors from 'cors';
import http from 'http';
import helmet from 'helmet';
import express, { Express } from 'express';
import { ServerInterface } from '../../models/ServerInterface';
import { WsServer } from './WsServer';
import { Logger } from '../../services/Logger';
import path from 'path';

export class HttpServer implements ServerInterface {
    private expressApp?: Express;
    private wsServer?: WsServer;
    private port?: number;
    
    constructor(port: number, wsServer: WsServer) {
        this.port = port;
        this.wsServer = wsServer;
    }
    get serviceApp(): Express | undefined { return this.expressApp; }

    close(): boolean {
        this.expressApp = undefined;
        return true;
    }

    open(): HttpServer {
        this.wsServer!.open();
        this.wsServer!.receive();
        this.expressApp = express();

        // if(this.bindUI) {
        //     this.expressApp.use(express.static('public')); 
        //     const baseDir = '/home/pangz/Documents/GitHub/verus-explorer-api/';
        //     [
        //         '/block/:blockHash',
        //         '/tx/send',
        //         '/tx/:txId/:v_type?/:v_index?',
        //         '/',
        //         '/blocks',
        //         '/blocks-date/:blockDate/:startTimestamp?',
        //         '/address/:addrStr',
        //         '/charts/:chartType?',
        //         '/status',
        //         '/messages/verify',
        //         '/help'
        //     ].forEach(route => {
        //         this.expressApp!.get(route, function(req, res) {
        //             res.sendFile(path.join(baseDir, 'public', 'index.html'));
        //         });
        //     });

        // } else {
            this.expressApp.use(cors({
                // origin: ['https://wip-api-insight.pangz.tech', 'http://localhost:2221'], // Add your allowed origins here
                // origin: ['https://wip-insight.pangz.tech', 'http://localhost:2220', 'http://localhost:2221', 'http://localhost:2223'], // Add your allowed origins here
                // origin: '*',
            }));
        // }

        this.expressApp.use(helmet());
        this.expressApp.use(express.json()) // for parsing application/json
        this.expressApp.use(express.urlencoded({ extended: true }));
        
        // this.expressApp!.options('*', (req: Request, res: Response) => {
        //     // res.setHeader('Access-Control-Allow-Origin', '*');
        //     // res.setHeader('Access-Control-Allow-Origin', ['http://localhost:2220']);
        //     res.setHeader('Access-Control-Allow-Origin', ['http://localhost:2221']);
        //     // res.setHeader('Access-Control-Allow-Origin', );
        //     // next();
        // });
        
        const httpServer = this.expressApp.listen(this.port!);
        this.attachWsServerConnection(httpServer);
        Logger.toDebugLog("HTTP and WS Server running in port " + this.port! + "...").write();
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
                    ws.send(JSON.stringify({data: 'connection established'}));
                });
            } else {
                socket.destroy();
            }
        });
    }
}