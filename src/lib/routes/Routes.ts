import { Express } from 'express';
import { Block as BlockController } from "../controllers/Block";
import { Address as AddressController } from "../controllers/Address";
import { Identity as IdentityController } from "../controllers/Identity";
import { Blockchain as BlockchainController } from "../controllers/Blockchain";
import { Transaction as TransactionController } from "../controllers/Transaction";

export class Routes {
    static generate(app: Express): void {
        app.post('/api/blocks/generated', BlockController.generated);
        app.post('/api/block/hashes', BlockController.hashes);
        app.post('/api/block/info', BlockController.info);
        app.get('/api/blockchain/mining/info', BlockchainController.miningInfo);
        app.get('/api/blockchain/info', BlockchainController.info);
        app.get('/api/blockchain/height', BlockchainController.height);
        app.get('/api/blockchain/status', BlockchainController.status);
        app.post('/api/transaction/info', TransactionController.info);
        app.post('/api/identity/info', IdentityController.info);
        app.post('/api/address/txids', AddressController.txIds);
        app.post('/api/address/balance', AddressController.balance);
    }
}