import express, { Express } from 'express';
import { BlockController } from "../controllers/BlockController";
import { SearchController } from '../controllers/SearchController';
import { AddressController } from "../controllers/AddressController";
import { IdentityController } from "../controllers/IdentityController";
import { BlockchainController } from "../controllers/BlockchainController";
import { TransactionController } from "../controllers/TransactionController";
import { ChartController } from '../controllers/ChartController';
import { StatsController } from '../controllers/StatsController';
import path from 'path';

export class Routes {
    static generate(app: Express): void {
        app.post('/api/blocks/generated', BlockController.generated);
        app.post('/api/block/hashes', BlockController.hashes);
        app.get('/api/block/:heightOrHash/info', BlockController.info);
        app.get('/api/blockchain/mining/info', BlockchainController.miningInfo);
        app.get('/api/blockchain/info', BlockchainController.info);
        app.get('/api/blockchain/height', BlockchainController.height);
        app.get('/api/blockchain/status', BlockchainController.status);
        app.get('/api/transaction/:txHash/info', TransactionController.info);
        app.get('/api/identity/:id/info', IdentityController.info);
        app.get('/api/address/:address/txids', AddressController.txIds);
        app.get('/api/address/:address/balance', AddressController.balance);
        app.get('/api/search/', SearchController.query);
        app.get('/api/chart/:type/', ChartController.query);
        app.get('/api/stats/mining/', StatsController.pool);
    }

    static generateUI(app: Express, baseDir: string, routes: string[]) {
        const p = baseDir.split('/');
        app.use(express.static(p[p.length - 1]));
        routes.forEach(route => {
            app.get(route, function(req, res) {
                res.sendFile(path.join(baseDir, 'index.html'));
            });
        });
    }
}