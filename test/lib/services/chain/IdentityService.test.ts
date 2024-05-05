import { IdentityService } from '../../../../src/lib/services/chain/IdentityService';
import { ChainNativeApi } from '../../../../src/lib/services/chain/ChainNativeApi';
import { Payload } from '../../../../src/lib/services/Payload';

jest.mock('../../../../src/lib/services/chain/ChainNativeApi');
jest.mock('../../../../src/lib/services/Payload');

describe('IdentityService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getInfo', () => {
        it('should return ServicePayload with success if API response status is 200 and no error', async () => {
            const identityValue = 'someIdentity';
            const responseData = { info: 'identity information' };
            const responseStatus = 200;
            (ChainNativeApi.getIdentity as jest.Mock).mockResolvedValueOnce({ status: responseStatus, data: { result: responseData }, error: false });

            const result = await IdentityService.getInfo(identityValue);
            expect(result).toEqual(Payload.withSuccess(responseData));
            expect(ChainNativeApi.getIdentity).toHaveBeenCalledWith(identityValue, undefined);
        });

        it('should return ServicePayload with error if API response status is not 200 or has error', async () => {
            const identityValue = 'someIdentity';
            (ChainNativeApi.getIdentity as jest.Mock).mockResolvedValueOnce({ status: 500, data: { error: true } });

            const result = await IdentityService.getInfo(identityValue);
            expect(result).toEqual(Payload.withError());
            expect(ChainNativeApi.getIdentity).toHaveBeenCalledWith(identityValue, undefined);
        });

        it('should log error if an exception occurs during API call', async () => {
            const identityValue = 'someIdentity';
            const errorMessage = 'API error';
            (ChainNativeApi.getIdentity as jest.Mock).mockRejectedValueOnce(errorMessage);

            await IdentityService.getInfo(identityValue);
            expect(Payload.logError).toHaveBeenCalledWith('fetch identity info - [Exception] : ' + errorMessage, `Identity: ${identityValue}`, 'getInfo');
        });

        it('should pass height parameter to ChainNativeApi if provided', async () => {
            const identityValue = 'someIdentity';
            const height = 1000;
            (ChainNativeApi.getIdentity as jest.Mock).mockResolvedValueOnce({ status: 200, data: { result: {} }, error: false });

            await IdentityService.getInfo(identityValue, height);
            expect(ChainNativeApi.getIdentity).toHaveBeenCalledWith(identityValue, height);
        });
    });
});
