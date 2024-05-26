import express, { Express } from 'express';
import path from 'path';
import { BlockController } from "../controllers/chain/BlockController";
import { SearchController } from '../controllers/chain/SearchController';
import { AddressController } from "../controllers/chain/AddressController";
import { IdentityController } from "../controllers/chain/IdentityController";
import { BlockchainController } from "../controllers/chain/BlockchainController";
import { TransactionController } from "../controllers/chain/TransactionController";
import { ChartController } from '../controllers/chain/ChartController';
import { MiningPoolStatsController } from '../controllers/aggregator/MiningPoolStatsController';
import { CoinPaprikaController } from '../controllers/aggregator/CoinPaprikaController';

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
        app.get('/api/a/stats/mining/pool', MiningPoolStatsController.pool);
        app.get('/api/a/coinpaprika/coin/market', CoinPaprikaController.getCoinMarketData);
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