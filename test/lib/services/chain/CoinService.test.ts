import { CoinService } from '../../../../src/lib/services/chain/CoinService';
import { ChainNativeApi } from '../../../../src/lib/services/chain/ChainNativeApi';
import { Payload } from '../../../../src/lib/services/Payload';

jest.mock('../../../../src/lib/services/chain/ChainNativeApi');
jest.mock('../../../../src/lib/services/Payload');

describe('CoinService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getSupplyInfo', () => {
        it('should return ServicePayload with success if API response status is 200 and no error', async () => {
            const responseData = { supplyInfo: 'coin supply information' };
            (ChainNativeApi.getCoinSupply as jest.Mock).mockResolvedValueOnce({ status: 200, data: { result: responseData }, error: false });

            const result = await CoinService.getSupplyInfo();
            expect(result).toEqual(Payload.withSuccess(responseData));
            expect(ChainNativeApi.getCoinSupply).toHaveBeenCalled();
        });

        it('should return ServicePayload with error if API response status is not 200 or has error', async () => {
            (ChainNativeApi.getCoinSupply as jest.Mock).mockResolvedValueOnce({ status: 500, data: { error: true } });

            const result = await CoinService.getSupplyInfo();
            expect(result).toEqual(Payload.withError());
            expect(ChainNativeApi.getCoinSupply).toHaveBeenCalled();
        });

        it('should log error if an exception occurs during API call', async () => {
            const errorMessage = 'API error';
            (ChainNativeApi.getCoinSupply as jest.Mock).mockRejectedValueOnce(errorMessage);

            await CoinService.getSupplyInfo();
            expect(Payload.logError).toHaveBeenCalledWith('fetch coin supply info - [Exception] : ' + errorMessage, `Data: -`, 'getSupplyInfo');
        });
    });
});
