import { ChainNativeApi } from '../../../../src/lib/services/chain/ChainNativeApi';
import { AddressService } from '../../../../src/lib/services/chain/AddressService';
import { Payload, SuccessPayload } from '../../../../src/lib/services/Payload';

jest.mock('../../../../src/lib/services/chain/ChainNativeApi');

describe('AddressService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAddressTxIds', () => {
        it('should return ServicePayload with success if API response status is 200 and no error', async () => {
            const address = 'testAddress';
            const responseData = { txIds: ['txId1', 'txId2'] };
            (ChainNativeApi.getAddressTxIds as jest.Mock).mockResolvedValueOnce({ status: 200, data: { result: responseData }, error: false });
            const result = (await AddressService.getTxIds(address)) as SuccessPayload;
            expect(result).toEqual(Payload.withSuccess(responseData));
        });

        it('should return ServicePayload with error if API response status is not 200 or has error', async () => {
            const address = 'testAddress';
            (ChainNativeApi.getAddressTxIds as jest.Mock).mockResolvedValueOnce({ status: 500, data: { error: true } });
            const result = await AddressService.getTxIds(address);
            expect(result).toEqual(Payload.withError());
        });

        it('should log error if an exception occurs during API call', async () => {
            const address = 'testAddress';
            const errorMessage = 'API error';
            try {
                jest.mock('../../../../src/lib/services/Payload');
                (ChainNativeApi.getAddressTxIds as jest.Mock).mockRejectedValueOnce(errorMessage);
                await AddressService.getTxIds(address);
            } catch (e) {
                expect(Payload.logError).toHaveBeenCalledWith('fetch address txids - [Exception] : ' + errorMessage, `Address: ${address}`, 'getTxIds');
            }
        });
    });

    describe('getBalance', () => {
        it('should return ServicePayload with success if API response status is 200 and no error', async () => {
            const address = 'testAddress';
            const responseData = { balance: 100 };
            (ChainNativeApi.getAddressBalance as jest.Mock).mockResolvedValueOnce({ status: 200, data: { result: responseData }, error: false });
            const result = await AddressService.getBalance(address);
            expect(result).toEqual(Payload.withSuccess(responseData));
            expect(ChainNativeApi.getAddressBalance).toHaveBeenCalledWith([address]);
        });

        it('should return ServicePayload with error if API response status is not 200 or has error', async () => {
            jest.mock('../../../../src/lib/services/Payload');
            const address = 'testAddress';
            (ChainNativeApi.getAddressBalance as jest.Mock).mockResolvedValueOnce({ status: 500, data: { error: true } });
            const result = await AddressService.getBalance(address);
            expect(result).toEqual(Payload.withError());
            expect(ChainNativeApi.getAddressBalance).toHaveBeenCalledWith([address]);
        });

        it('should log error if an exception occurs during API call', async () => {
            jest.mock('../../../../src/lib/services/Payload');
            const address = 'testAddress';
            const errorMessage = 'API error';
            try {
                (ChainNativeApi.getAddressBalance as jest.Mock).mockRejectedValueOnce(errorMessage);
                await AddressService.getBalance(address);
            } catch(e) {
                expect(Payload.logError).toHaveBeenCalledWith('fetch address balance - [Exception] : ' + errorMessage, `Address: ${address}`, 'getBalance');
            }
            
        });
    });
});
