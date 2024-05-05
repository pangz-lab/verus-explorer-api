// import { TransactionService } from '../../../../src/lib/services/chain/TransactionService';
// import { ChainNativeApi } from '../../../../src/lib/services/chain/ChainNativeApi';
// import { ErrorPayload, Payload, ServicePayload } from '../../../../src/lib/services/Payload';

// jest.mock('../../../../src/lib/services/chain/TransactionService');
// jest.mock('../../../../src/lib/services/Payload');


// describe('TransactionService', () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     describe('getInfo', () => {
//         it('should return ServicePayload with error if API call fails', async () => {
//             const txHash = 'invalidTxHash';
//             (ChainNativeApi.getTransactionInfo as jest.Mock).mockResolvedValueOnce({ status: 500, data: { error: true } });

//             const result = await TransactionService.getInfo(txHash);
//             expect((result as ErrorPayload).error).toEqual(Payload.withError().error);
//             expect(Payload.logError).toHaveBeenCalledWith('fetch transaction info', `Data: ${txHash}`, 'getInfo');
//         });

//     //     it('should return ServicePayload with error if data is undefined', async () => {
//     //         const txHash = 'validTxHash';
//     //         (ChainNativeApi.getTransactionInfo as jest.Mock).mockResolvedValueOnce({ status: 200, data: {} });

//     //         const result = await TransactionService.getInfo(txHash);
//     //         expect(result).toEqual(Payload.withError());
//     //         expect(Payload.logError).toHaveBeenCalledWith('fetch transaction info', `Data: ${txHash}`, 'getInfo');
//     //     });

//     //     it('should return ServicePayload with success if API call succeeds', async () => {
//     //         const txHash = 'validTxHash';
//     //         const mockData = { txid: 'txid', vout: 'vout', time: 123, height: 456, blockhash: 'blockhash' };
//     //         (ChainNativeApi.getTransactionInfo as jest.Mock).mockResolvedValueOnce({ status: 200, data: { result: mockData } });

//     //         const result = await TransactionService.getInfo(txHash);
//     //         expect(result).toEqual(Payload.withSuccess(mockData));
//     //     });

//     //     it('should return ServicePayload with error if an exception occurs during API call', async () => {
//     //         const txHash = 'validTxHash';
//     //         const errorMessage = 'API error';
//     //         (ChainNativeApi.getTransactionInfo as jest.Mock).mockRejectedValueOnce(errorMessage);

//     //         const result = await TransactionService.getInfo(txHash);
//     //         expect(result).toEqual(Payload.withError());
//     //         expect(Payload.logError).toHaveBeenCalledWith('fetch transaction info - [Exception] : ' + errorMessage, `Data: ${txHash}`, 'getInfo');
//     //     });
//     });

//     // describe('getBlockTxsInfoSummary', () => {
//     //     it('should return array of BlockTxInfoSummary objects for valid block txs', async () => {
//     //         const blockTxs = ['validTx1', 'validTx2'];
//     //         const mockData = { txid: 'txid', vout: 'vout', time: 123, height: 456, blockhash: 'blockhash' };
//     //         (TransactionService.getInfo as jest.Mock).mockResolvedValueOnce(Payload.withSuccess(mockData));
//     //         (TransactionService.getInfo as jest.Mock).mockResolvedValueOnce(Payload.withSuccess(mockData));

//     //         const result = await TransactionService.getBlockTxsInfoSummary(blockTxs);
//     //         expect(result).toEqual([{ ...mockData }, { ...mockData }]);
//     //     });

//     //     it('should retry if getInfo returns error for a tx', async () => {
//     //         const blockTxs = ['validTx1'];
//     //         const mockData = { txid: 'txid', vout: 'vout', time: 123, height: 456, blockhash: 'blockhash' };
//     //         (TransactionService.getInfo as jest.Mock).mockResolvedValueOnce(Payload.withError()).mockResolvedValueOnce(Payload.withSuccess(mockData));

//     //         const result = await TransactionService.getBlockTxsInfoSummary(blockTxs);
//     //         expect(result).toEqual([{ ...mockData }]);
//     //         expect(TransactionService.getInfo).toHaveBeenCalledTimes(2);
//     //     });

//     //     it('should log error and continue if getInfo repeatedly returns error for a tx', async () => {
//     //         const blockTxs = ['validTx1'];
//     //         const errorMessage = 'API error';
//     //         (TransactionService.getInfo as jest.Mock).mockRejectedValueOnce(errorMessage).mockRejectedValueOnce(errorMessage).mockRejectedValueOnce(errorMessage);

//     //         const result = await TransactionService.getBlockTxsInfoSummary(blockTxs);
//     //         expect(result).toEqual([]);
//     //         expect(Payload.logError).toHaveBeenCalledTimes(3);
//     //     });
//     // });
// });
