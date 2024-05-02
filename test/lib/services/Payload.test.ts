import { Logger } from '../../../src/lib/services/Logger';
import { Payload } from '../../../src/lib/services/Payload';

jest.mock('../../../src/lib/services/Logger', () => ({
    Logger: {
        toErrorLog: jest.fn().mockReturnThis(),
        write: jest.fn()
    }
}));

describe('Payload', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('withError', () => {
        it('should return ErrorPayload with provided value', () => {
            const value = 'error message';
            const errorPayload = Payload.withError(value);
            expect(errorPayload).toEqual({ data: value, error: true });
        });

        it('should return ErrorPayload with empty array if no value provided', () => {
            const errorPayload = Payload.withError();
            expect(errorPayload).toEqual({ data: [], error: true });
        });
    });

    describe('withSuccess', () => {
        it('should return SuccessPayload with provided object data', () => {
            const data = { key: 'value' };
            const successPayload = Payload.withSuccess(data);
            expect(successPayload).toEqual({ data: data, error: false });
        });
        
        it('should return SuccessPayload with provided array data', () => {
            const data = ['key', 'value' ];
            const successPayload = Payload.withSuccess(data);
            expect(successPayload).toEqual({ data: data, error: false });
        });
    });

    describe('logError', () => {
        it('should log error message', () => {
            const data = 'operation';
            const value = 'error value';
            const method = 'methodName';
            Payload.logError(data, value, method);
            expect(Logger.toErrorLog).toHaveBeenCalledTimes(1);
        });
    });
});
