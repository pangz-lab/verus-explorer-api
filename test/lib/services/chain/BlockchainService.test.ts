import { BlockchainService, BlockchainStatusSummary } from '../../../../src/lib/services/chain/BlockchainService';
import { ChainNativeApi } from '../../../../src/lib/services/chain/ChainNativeApi';
import { Payload } from '../../../../src/lib/services/Payload';
import { BlockService } from '../../../../src/lib/services/chain/BlockService';
import { TransactionService } from '../../../../src/lib/services/chain/TransactionService';
import { CoinService } from '../../../../src/lib/services/chain/CoinService';
import { error } from 'console';

jest.mock('../../../../src/lib/services/chain/ChainNativeApi');
jest.mock('../../../../src/lib/services/chain/BlockService');
jest.mock('../../../../src/lib/services/chain/TransactionService');
jest.mock('../../../../src/lib/services/chain/CoinService');
jest.mock('../../../../src/lib/services/Payload');

describe('BlockchainService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getInfo', () => {
        it('should return ServicePayload with success if API response status is 200 and no error', async () => {
            const responseData = { info: 'blockchain info' };
            (ChainNativeApi.getInfo as jest.Mock).mockResolvedValueOnce({ status: 200, data: { result: responseData }, error: false });
            const result = await BlockchainService.getInfo();
            expect(result).toEqual(Payload.withSuccess(responseData));
            expect(ChainNativeApi.getInfo).toHaveBeenCalled();
        });

        it('should return ServicePayload with error if API response status is not 200 or has error', async () => {
            (ChainNativeApi.getInfo as jest.Mock).mockResolvedValueOnce({ status: 500, data: { error: true } });
            const result = await BlockchainService.getInfo();
            expect(result).toEqual(Payload.withError());
            expect(ChainNativeApi.getInfo).toHaveBeenCalled();
        });

        it('should log error if an exception occurs during API call', async () => {
            const errorMessage = 'API error';
            (ChainNativeApi.getInfo as jest.Mock).mockRejectedValueOnce(errorMessage);
            await BlockchainService.getInfo();
            expect(Payload.logError).toHaveBeenCalled();
        });
    });

    describe('getMiningInfo', () => {
        it('should return ServicePayload with success if API response status is 200 and no error', async () => {
            const responseData = { miningInfo: 'mining info' };
            (ChainNativeApi.getMiningInfo as jest.Mock).mockResolvedValueOnce({ status: 200, data: { result: responseData }, error: false });
            const result = await BlockchainService.getMiningInfo();
            expect(result).toEqual(Payload.withSuccess(responseData));
            expect(ChainNativeApi.getMiningInfo).toHaveBeenCalled();
        });

        it('should return ServicePayload with error if API response status is not 200 or has error', async () => {
            (ChainNativeApi.getMiningInfo as jest.Mock).mockResolvedValueOnce({ status: 500, data: { error: true } });
            const result = await BlockchainService.getMiningInfo();
            expect(result).toEqual(Payload.withError());
            expect(ChainNativeApi.getMiningInfo).toHaveBeenCalled();
        });

        it('should log error if an exception occurs during API call', async () => {
            const errorMessage = 'API error';
            (ChainNativeApi.getMiningInfo as jest.Mock).mockRejectedValueOnce(errorMessage);
            await BlockchainService.getMiningInfo();
            expect(Payload.logError).toHaveBeenCalled();
        });
    });

    describe('getHeight', () => {
        it('should return ServicePayload with success if API response status is 200 and no error', async () => {
            const responseData = 100;
            (ChainNativeApi.getBlockCount as jest.Mock).mockResolvedValueOnce({ status: 200, data: { result: responseData }, error: false });
            const result = await BlockchainService.getHeight();
            expect(result).toEqual(Payload.withSuccess(responseData));
            expect(ChainNativeApi.getBlockCount).toHaveBeenCalled();
        });

        it('should return ServicePayload with error if API response status is not 200 or has error', async () => {
            (ChainNativeApi.getBlockCount as jest.Mock).mockResolvedValueOnce({ status: 500, data: { error: true } });
            const result = await BlockchainService.getHeight();
            expect(result).toEqual(Payload.withError());
            expect(ChainNativeApi.getBlockCount).toHaveBeenCalled();
        });

        it('should log error if an exception occurs during API call', async () => {
            const errorMessage = 'API error';
            (ChainNativeApi.getBlockCount as jest.Mock).mockRejectedValueOnce(errorMessage);
            await BlockchainService.getHeight();
            expect(Payload.logError).toHaveBeenCalled();
        });
    });

    describe('getStatus', () => {
        it('should return ServicePayload with success if all API calls are successful', async () => {
            const getInfoResponse = { status: 200, data: { result: { info: 'blockchain info' } }, error: false };
            const getMiningInfoResponse = { status: 200, data: { result: { miningInfo: 'mining info' } }, error: false };
            const getSupplyInfoResponse = { status: 200, data: { result: { supplyInfo: 'supply info' } }, error: false };
            (ChainNativeApi.getInfo as jest.Mock).mockResolvedValueOnce(getInfoResponse);
            (ChainNativeApi.getMiningInfo as jest.Mock).mockResolvedValueOnce(getMiningInfoResponse);
            (CoinService.getSupplyInfo as jest.Mock).mockResolvedValueOnce(getSupplyInfoResponse);

            const result = await BlockchainService.getStatus();
            expect(result).toEqual(Payload.withSuccess([getInfoResponse.data.result, getMiningInfoResponse.data.result, getSupplyInfoResponse.data.result]));
            expect(ChainNativeApi.getInfo).toHaveBeenCalled();
            expect(ChainNativeApi.getMiningInfo).toHaveBeenCalled();
            expect(CoinService.getSupplyInfo).toHaveBeenCalled();
        });

        it('should return ServicePayload with error if any API call fails', async () => {
            const getInfoResponse = { status: 500, data: { error: true } };
            const getMiningInfoResponse = { status: 200, data: { result: { miningInfo: 'mining info' } }, error: false };
            const getSupplyInfoResponse = { status: 200, data: { result: { supplyInfo: 'supply info' } }, error: false };
            (ChainNativeApi.getInfo as jest.Mock).mockResolvedValueOnce(getInfoResponse);
            (ChainNativeApi.getMiningInfo as jest.Mock).mockResolvedValueOnce(getMiningInfoResponse);
            (CoinService.getSupplyInfo as jest.Mock).mockResolvedValueOnce(getSupplyInfoResponse);

            const result = await BlockchainService.getStatus();
            expect(result).toEqual(Payload.withError());
            expect(ChainNativeApi.getInfo).toHaveBeenCalled();
            expect(ChainNativeApi.getMiningInfo).toHaveBeenCalled();
            expect(CoinService.getSupplyInfo).toHaveBeenCalled();
        });

        it('should log error if an exception occurs during API call', async () => {
            const errorMessage = 'API error';
            (ChainNativeApi.getInfo as jest.Mock).mockRejectedValueOnce(errorMessage);
            await BlockchainService.getStatus();
            expect(Payload.logError).toHaveBeenCalled();
        });
    });

    // describe('getStatusSummary', () => {
    //     it('should return ServicePayload with success if getStatus returns success', async () => {
    //         const getStatusResponse = [
    //             { data: { VRSCversion: 'v1', protocolversion: '2', blocks: 100, longestchain: 100, connections: 5, difficulty: 10, version: '3', networkhashps: 1000, supply: 5000, total: 10000, zfunds: 500 }, error: false},
    //             { data: { networkhashps: 1000 }, error: false},
    //             { data: { supply: 5000, total: 10000, zfunds: 500 }, error: false},
    //         ];
    //         (BlockchainService.getStatus as jest.Mock).mockResolvedValueOnce({ data: getStatusResponse, error: false });

    //         const expectedResult = {
    //             VRSCversion: 'v1',
    //             protocolVersion: '2',
    //             blocks: 100,
    //             longestchain: 100,
    //             connections: 5,
    //             difficulty: 10,
    //             version: '3',
    //             networkHashrate: 1000,
    //             circulatingSupply: 5000,
    //             circulatingSupplyTotal: 10000,
    //             circulatingZSupply: 500
    //         };
    //         const result = await BlockchainService.getStatusSummary();
    //         // expect(result).toEqual(Payload.withSuccess<BlockchainStatusSummary>(expectedResult));
    //         // expect(BlockchainService.getStatus).toHaveBeenCalled();
    //     });

    //     // it('should return ServicePayload with error if getStatus returns error', async () => {
    //     //     (BlockchainService.getStatus as jest.Mock).mockResolvedValueOnce(Payload.withError());
    //     //     const result = await BlockchainService.getStatusSummary();
    //     //     expect(result).toEqual(Payload.withError());
    //     //     expect(BlockchainService.getStatus).toHaveBeenCalled();
    //     // });
    // });

    // describe('getCurrentState', () => {
    //     it('should return LatestChainStatePayload with correct data', async () => {
    //         const blockHeight = 100;
    //         const currentHeightResponse = { status: 200, data: { result: blockHeight }, error: false };
    //         (ChainNativeApi.getBlockCount as jest.Mock).mockResolvedValueOnce(currentHeightResponse);

    //         const blockInfoResponse = { status: 200, data: { result: { height: blockHeight, hash: 'blockHash' } }, error: false };
    //         (BlockService.getInfo as jest.Mock).mockResolvedValueOnce(blockInfoResponse);

    //         const blockBasicInfoResponse = { txs: ['tx1', 'tx2'], hash: 'blockHash' };
    //         (BlockService.getBasicInfo as jest.Mock).mockResolvedValueOnce(blockBasicInfoResponse);

    //         const txsInfoResponse = { tx1: { info: 'tx1info' }, tx2: { info: 'tx2info' } };
    //         (TransactionService.getBlockTxsInfoSummary as jest.Mock).mockResolvedValueOnce(txsInfoResponse);

    //         const chainStatusSummaryResponse = { VRSCversion: 'v1', protocolversion: '2', blocks: 100, longestchain: 100, connections: 5, difficulty: 10, version: '3', networkhashps: 1000, supply: 5000, total: 10000, zfunds: 500 };
    //         (BlockchainService.getStatusSummary as jest.Mock).mockResolvedValueOnce(chainStatusSummaryResponse);

    //         const expectedResult = {
    //             status: { data: chainStatusSummaryResponse, error: false },
    //             latestBlock: { data: blockBasicInfoResponse, error: false },
    //             latestTxs: { data: txsInfoResponse, error: false },
    //             nodeState: { data: {}, error: false }
    //         };
    //         const result = await BlockchainService.getCurrentState();
    //         console.log(result);
    //         expect(result).toEqual(expectedResult);
    //     });

    //     it('should return LatestChainStatePayload with undefined if an error occurs during API calls', async () => {
    //         (ChainNativeApi.getBlockCount as jest.Mock).mockResolvedValueOnce({ status: 500, data: { error: true } });

    //         const result = await BlockchainService.getCurrentState();
    //         expect(result).toBeUndefined();
    //     });
    // });
});
