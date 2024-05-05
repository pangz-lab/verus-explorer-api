import { SearchService, QueryValueType  } from '../../../../src/lib/services/chain/SearchService';
import { Payload } from '../../../../src/lib/services/Payload';
import { AddressValidator, AddressType } from '../../../../src/lib/services/Validator';
import { IdentityValidator } from '../../../../src/lib/services/Validator';
import { TransactionService } from '../../../../src/lib/services/chain/TransactionService';

jest.mock('../../../../src/lib/services/Validator');
jest.mock('../../../../src/lib/services/chain/TransactionService');
jest.mock('../../../../src/lib/services/Payload');


describe('SearchService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('findQuery', () => {
        it('should return ServicePayload with error if query length is greater than 80', async () => {
            const query = 'a'.repeat(81);
            const result = await SearchService.findQuery(query);
            expect(result).toEqual(Payload.withError({ type: QueryValueType.unknown, value: query, valid: false }));
        });

        it('should return ServicePayload with error if query does not end with "@" and is not a valid verusId', async () => {
            const query = 'invalid@';
            (IdentityValidator.isValidVerusId as jest.Mock).mockReturnValueOnce(false);

            const result = await SearchService.findQuery(query);
            expect(result).toEqual(Payload.withError({ type: QueryValueType.unknown, value: query, valid: false }));
            expect(IdentityValidator.isValidVerusId).toHaveBeenCalledWith(query.slice(0, -1));
        });

        it('should return ServicePayload with success if query ends with "@" and is a valid verusId', async () => {
            const query = 'valid@';
            (IdentityValidator.isValidVerusId as jest.Mock).mockReturnValueOnce(true);

            const result = await SearchService.findQuery(query);
            expect(result).toEqual(Payload.withSuccess({ type: QueryValueType.verusId, value: query, valid: true }));
            expect(IdentityValidator.isValidVerusId).toHaveBeenCalledWith(query.slice(0, -1));
        });

        it('should return ServicePayload with success if query is a valid address', async () => {
            const query = 'validAddress';
            (AddressValidator.getType as jest.Mock).mockReturnValueOnce(AddressType.iAddress);

            const result = await SearchService.findQuery(query);
            expect(result).toEqual(Payload.withSuccess({ type: QueryValueType.address, value: query, valid: true }));
            expect(AddressValidator.getType).toHaveBeenCalledWith(query);
        });

        // it('should return ServicePayload with success if query is a valid txHash', async () => {
        //     const query = 'validTxHash';
        //     (TransactionService.getInfo as jest.Mock).mockResolvedValueOnce(Payload.withSuccess({}));

        //     const result = await SearchService.findQuery(query);
        //     expect(result).toEqual(Payload.withSuccess({ type: QueryValueType.txHash, value: query, valid: true }));
        //     expect(TransactionService.getInfo).toHaveBeenCalledWith(query);
        // });

        // it('should return ServicePayload with success if query is a valid blockHash', async () => {
        //     const query = 'validBlockHash';
        //     (TransactionService.getInfo as jest.Mock).mockResolvedValueOnce(Payload.withError({}));

        //     const result = await SearchService.findQuery(query);
        //     expect(result).toEqual(Payload.withSuccess({ type: QueryValueType.blockHash, value: query, valid: true }));
        //     expect(TransactionService.getInfo).toHaveBeenCalledWith(query);
        // });

        // it('should return ServicePayload with success if query is a valid block', async () => {
        //     const query = 'validBlock';
        //     (TransactionService.getInfo as jest.Mock).mockResolvedValueOnce(Payload.withError({}));
        //     (TransactionService.getInfo as jest.Mock).mockResolvedValueOnce(Payload.withSuccess({}));

        //     const result = await SearchService.findQuery(query);
        //     expect(result).toEqual(Payload.withSuccess({ type: QueryValueType.block, value: query, valid: true }));
        //     expect(TransactionService.getInfo).toHaveBeenCalledWith(query);
        // });

        // it('should return ServicePayload with error if an exception occurs during query processing', async () => {
        //     const query = 'validQuery';
        //     const errorMessage = 'API error';
        //     (TransactionService.getInfo as jest.Mock).mockRejectedValueOnce(errorMessage);

        //     const result = await SearchService.findQuery(query);
        //     expect(result).toEqual(Payload.withError({ type: QueryValueType.unknown, value: query, valid: false }));
        //     expect(Payload.logError).toHaveBeenCalledWith('search info - [Exception] : ' + errorMessage, `Query: ${query}`, 'findQuery');
        // });
    });
});
