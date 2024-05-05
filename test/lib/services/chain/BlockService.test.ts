import { BlockService } from '../../../../src/lib/services/chain/BlockService';
import { ChainNativeApi } from '../../../../src/lib/services/chain/ChainNativeApi';
import { Payload } from '../../../../src/lib/services/Payload';

jest.mock('../../../../src/lib/services/chain/ChainNativeApi');
jest.mock('../../../../src/lib/services/Payload');

describe('BlockService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getInfo', () => {
        it('should return ServicePayload with success if API response status is 200 and no error', async () => {
            const blockHeightOrHash = 'blockHeightOrHash';
            const responseData = { blockInfo: 'block information' };
            (ChainNativeApi.getBlockDetail as jest.Mock).mockResolvedValueOnce({ status: 200, data: { result: responseData }, error: false });

            const result = await BlockService.getInfo(blockHeightOrHash);
            expect(result).toEqual(Payload.withSuccess(responseData));
            expect(ChainNativeApi.getBlockDetail).toHaveBeenCalledWith(blockHeightOrHash);
        });

        it('should return ServicePayload with error if API response status is not 200 or has error', async () => {
            const blockHeightOrHash = 'blockHeightOrHash';
            (ChainNativeApi.getBlockDetail as jest.Mock).mockResolvedValueOnce({ status: 500, data: { error: true } });

            const result = await BlockService.getInfo(blockHeightOrHash);
            expect(result).toEqual(Payload.withError());
            expect(ChainNativeApi.getBlockDetail).toHaveBeenCalledWith(blockHeightOrHash);
        });

        it('should log error if an exception occurs during API call', async () => {
            const blockHeightOrHash = 'blockHeightOrHash';
            const errorMessage = 'API error';
            (ChainNativeApi.getBlockDetail as jest.Mock).mockRejectedValueOnce(errorMessage);

            await BlockService.getInfo(blockHeightOrHash);
            expect(Payload.logError).toHaveBeenCalledWith('fetch block info - [Exception] : ' + errorMessage, `Data: ${blockHeightOrHash}`, 'getInfo');
        });
    });

    describe('getHashesByRange', () => {
        it('should return ServicePayload with success if API response status is 200 and no error', async () => {
            const start = 0;
            const end = 10;
            const responseData = ['hash1', 'hash2'];
            (ChainNativeApi.getBlockHashes as jest.Mock).mockResolvedValueOnce({ status: 200, data: { result: responseData }, error: false });

            const result = await BlockService.getHashesByRange(start, end);
            expect(result).toEqual(Payload.withSuccess(responseData));
            expect(ChainNativeApi.getBlockHashes).toHaveBeenCalledWith([start.toString(), end.toString()]);
        });

        it('should return ServicePayload with error if API response status is not 200 or has error', async () => {
            const start = 0;
            const end = 10;
            (ChainNativeApi.getBlockHashes as jest.Mock).mockResolvedValueOnce({ status: 500, data: { error: true } });

            const result = await BlockService.getHashesByRange(start, end);
            expect(result).toEqual(Payload.withError());
            expect(ChainNativeApi.getBlockHashes).toHaveBeenCalledWith([start.toString(), end.toString()]);
        });

        it('should log error if an exception occurs during API call', async () => {
            const start = 0;
            const end = 10;
            const errorMessage = 'API error';
            (ChainNativeApi.getBlockHashes as jest.Mock).mockRejectedValueOnce(errorMessage);

            await BlockService.getHashesByRange(start, end);
            expect(Payload.logError).toHaveBeenCalled();
        });
    });

    describe('getGeneratedFromHash', () => {
        it('should return ServicePayload with success if API response status is 200 and no error', async () => {
            const hashList = ['hash1', 'hash2'];
            const responseData = [{ hash: 'hash1', height: 1, time: 100, txCount: 2 }, { hash: 'hash2', height: 2, time: 200, txCount: 3 }];
            (ChainNativeApi.getBlockDetail as jest.Mock).mockResolvedValueOnce({ status: 200, data: { result: { hash: hashList[0], height: 1, time: 100, tx: ['tx1', 'tx2'] }, error: false } });
            (ChainNativeApi.getBlockDetail as jest.Mock).mockResolvedValueOnce({ status: 200, data: { result: { hash: hashList[1], height: 2, time: 200, tx: ['tx3', 'tx4', 'tx5'] }, error: false } });

            const result = await BlockService.getGeneratedFromHash(hashList);
            expect(result).toEqual(Payload.withSuccess(responseData));
            expect(ChainNativeApi.getBlockDetail).toHaveBeenNthCalledWith(1, hashList[0]);
            expect(ChainNativeApi.getBlockDetail).toHaveBeenNthCalledWith(2, hashList[1]);
        });

        it('should return ServicePayload with error if API response status is not 200 or has error', async () => {
            const hashList = ['hash1', 'hash2'];
            (ChainNativeApi.getBlockDetail as jest.Mock).mockResolvedValueOnce({ status: 500, data: { error: true } });

            const result = await BlockService.getGeneratedFromHash(hashList);
            expect(result).toEqual(Payload.withSuccess([]));
            expect(ChainNativeApi.getBlockDetail).toHaveBeenCalledWith(hashList[0]);
        });

        it('should log error if an exception occurs during API call', async () => {
            const hashList = ['hash1', 'hash2'];
            const errorMessage = 'API error';
            (ChainNativeApi.getBlockDetail as jest.Mock).mockRejectedValueOnce(errorMessage);

            await BlockService.getGeneratedFromHash(hashList);
            expect(Payload.logError).toHaveBeenCalled();
        });
    });

    // describe('getSummary', () => {
    //     it('should return block summary if API response status is 200 and no error', async () => {
    //         const blockHeight = 1;
    //         const blockInfo = { height: 1, anchor: 'anchor', bits: 'bits', blocktype: 'blocktype', difficulty: 'difficulty', hash: 'hash', nonce: 'nonce', previousblockhash: 'prevHash', size: 'size', segid: 'segid', time: 'time', version: 'version', tx: ['tx1', 'tx2'] };
    //         const expectedSummary = { anchor: 'anchor', bits: 'bits', blocktype: 'blocktype', difficulty: 'difficulty', hash: 'hash', height: 1, nonce: 'nonce', previousblockhash: 'prevHash', segid: 'segid', size: 'size', time: 'time', version: 'version', txs: ['tx1', 'tx2'] };
    //         (BlockService.getInfo as jest.Mock).mockResolvedValueOnce(Payload.withSuccess(blockInfo));

    //         const result = await BlockService.getSummary(blockHeight);
    //         expect(result).toEqual(expectedSummary);
    //         expect(BlockService.getInfo).toHaveBeenCalledWith(blockHeight);
    //     });

    //     it('should return undefined if blockInfo error', async () => {
    //         const blockHeight = 1;
    //         (BlockService.getInfo as jest.Mock).mockResolvedValueOnce(Payload.withError());

    //         const result = await BlockService.getSummary(blockHeight);
    //         expect(result).toBeUndefined();
    //         expect(BlockService.getInfo).toHaveBeenCalledWith(blockHeight);
    //     });
    // });

    // describe('getBasicInfo', () => {
    //     it('should return block basic info if valid blockInfo provided', async () => {
    //         const blockInfo = { height: 1, anchor: 'anchor', bits: 'bits', blocktype: 'blocktype', difficulty: 'difficulty', hash: 'hash', nonce: 'nonce', previousblockhash: 'prevHash', size: 'size', segid: 'segid', time: 'time', version: 'version', tx: ['tx1', 'tx2'] };
    //         const expectedBasicInfo = { anchor: 'anchor', bits: 'bits', blocktype: 'blocktype', difficulty: 'difficulty', hash: 'hash', height: 1, nonce: 'nonce', previousblockhash: 'prevHash', segid: 'segid', size: 'size', time: 'time', version: 'version', txs: ['tx1', 'tx2'] };

    //         const result = await BlockService.getBasicInfo(blockInfo);
    //         expect(result).toEqual(expectedBasicInfo);
    //     });

    //     it('should return undefined if blockInfo is undefined', async () => {
    //         const blockInfo = undefined;
    //         const result = await BlockService.getBasicInfo(blockInfo);
    //         expect(result).toBeUndefined();
    //     });

    //     it('should return undefined if blockInfo.height is undefined', async () => {
    //         const blockInfo = { someKey: 'someValue' };
    //         const result = await BlockService.getBasicInfo(blockInfo);
    //         expect(result).toBeUndefined();
    //     });
    // });
});