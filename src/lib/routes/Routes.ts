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
        app.get('/api/block/:heightOrHash/info', BlockController.info);
        app.get('/api/blockchain/mining/info', BlockchainController.miningInfo);
        app.get('/api/blockchain/info', BlockchainController.info);
        app.get('/api/blockchain/height', BlockchainController.height);
        app.get('/api/blockchain/status', BlockchainController.status);
        app.get('/api/transaction/:txHash/info', TransactionController.info);
        app.post('/api/identity/info', IdentityController.info);
        app.get('/api/address/:address/txids', AddressController.txIds);
        app.get('/api/address/:address/balance', AddressController.balance);
    }
}