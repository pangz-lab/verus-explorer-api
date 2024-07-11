import express, { Express } from 'express';
import path from 'path';
import { BlockController } from "../controllers/chain/BlockController";
import { SearchController } from '../controllers/chain/SearchController';
import { AddressController } from "../controllers/chain/AddressController";
import { IdentityController } from "../controllers/chain/IdentityController";
import { BlockchainController } from "../controllers/chain/BlockchainController";
import { TransactionController } from "../controllers/chain/TransactionController";
import { ChartController } from '../controllers/chart/ChartController';
import { MiningPoolStatsController } from '../controllers/aggregator/MiningPoolStatsController';
import { CoinPaprikaController } from '../controllers/aggregator/CoinPaprikaController';
import { Logger } from '../../services/Logger';
import { ApiValidator } from '../middleware/ApiValidator';
import { AppConfig } from '../../../AppConfig';

export class Routes {
    private static ver = 'v1';
    static generate(app: Express): void {
        Logger.toDebugLog("🚏 Creating middlware ...").write();
        Routes.addMiddleware(app);
        
        Logger.toDebugLog("🚏 Creating API routes ...").write();
        app.post('/api/'+Routes.ver+'/blocks/generated', BlockController.generated);
        app.post('/api/'+Routes.ver+'/block/hashes', BlockController.hashes);
        app.get('/api/'+Routes.ver+'/block/:heightOrHash/info', BlockController.info);
        app.get('/api/'+Routes.ver+'/blockchain/mining/info', BlockchainController.miningInfo);
        app.get('/api/'+Routes.ver+'/blockchain/info', BlockchainController.info);
        app.get('/api/'+Routes.ver+'/blockchain/height', BlockchainController.height);
        app.get('/api/'+Routes.ver+'/blockchain/status', BlockchainController.status);
        app.get('/api/'+Routes.ver+'/transaction/:txHash/info', TransactionController.info);
        app.get('/api/'+Routes.ver+'/identity/:id/info', IdentityController.info);
        app.get('/api/'+Routes.ver+'/address/:address/txids', AddressController.txIdsByRange);
        app.get('/api/'+Routes.ver+'/address/:address/balance', AddressController.balance);
        app.get('/api/'+Routes.ver+'/search/', SearchController.query);
        app.get('/api/'+Routes.ver+'/chart/:type/', ChartController.query);
        app.get('/api/'+Routes.ver+'/a/stats/mining/pool', MiningPoolStatsController.pool);
        app.get('/api/'+Routes.ver+'/a/coinpaprika/coin/market', CoinPaprikaController.getCoinMarketData);
    }

    static generateUI(app: Express, baseDir: string, routes: string[]) {
        const p = baseDir.split('/');
        app.use(express.static(p[p.length - 1]));
        Logger.toDebugLog("🧮 Creating UI routes ...").write();
        routes.forEach(route => {
            Logger.toDebugLog("Creating '" + route + "' ...").write();
            app.get(route, function(req, res) {
                res.sendFile(path.join(baseDir, 'index.html'));
            });
        });
    }

    private static addMiddleware(app: Express) {
        if(AppConfig.get().localServerRequireKey) {
            app.use(ApiValidator.checkKey);
        }
    }
}