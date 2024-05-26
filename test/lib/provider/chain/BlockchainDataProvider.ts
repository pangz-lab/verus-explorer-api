import { ChainNativeApi } from '../../../../src/lib/services/chain/ChainNativeApi';
import { Payload } from '../../../../src/lib/services/Payload';
import { CoinService } from '../../../../src/lib/services/chain/CoinService';
import { BlockchainDataProvider } from '../../../../src/lib/provider/chain/BlockchainDataProvider';

jest.mock('../../../../src/lib/services/chain/ChainNativeApi');
jest.mock('../../../../src/lib/provider/chain/BlockchainDataProvider');
jest.mock('../../../../src/lib/services/chain/TransactionService');
jest.mock('../../../../src/lib/services/chain/CoinService');
jest.mock('../../../../src/lib/services/Payload');

describe('BlockchainDataProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getStatus', () => {
        it('should return ServicePayload with success if all API calls are successful', async () => {
            const getInfoResponse = { status: 200, data: { result: { info: 'blockchain info' } }, error: false };
            const getMiningInfoResponse = { status: 200, data: { result: { miningInfo: 'mining info' } }, error: false };
            const getSupplyInfoResponse = { status: 200, data: { result: { supplyInfo: 'supply info' } }, error: false };
            (ChainNativeApi.getInfo as jest.Mock).mockResolvedValueOnce(getInfoResponse);
            (ChainNativeApi.getMiningInfo as jest.Mock).mockResolvedValueOnce(getMiningInfoResponse);
            (CoinService.getSupplyInfo as jest.Mock).mockResolvedValueOnce(getSupplyInfoResponse);

            const result = await BlockchainDataProvider.getStatus();
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

            const result = await BlockchainDataProvider.getStatus();
            expect(result).toEqual(Payload.withError());
            expect(ChainNativeApi.getInfo).toHaveBeenCalled();
            expect(ChainNativeApi.getMiningInfo).toHaveBeenCalled();
            expect(CoinService.getSupplyInfo).toHaveBeenCalled();
        });

        it('should log error if an exception occurs during API call', async () => {
            const errorMessage = 'API error';
            (ChainNativeApi.getInfo as jest.Mock).mockRejectedValueOnce(errorMessage);
            await BlockchainDataProvider.getStatus();
            expect(Payload.logError).toHaveBeenCalled();
        });
    });
});
