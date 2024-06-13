import { ChartService } from '../../../../src/lib/services/chart/ChartService';
import { BlockService } from '../../../../src/lib/services/chain/BlockService';
import { Payload } from '../../../../src/lib/services/Payload';

// Mocking BlockService
jest.mock('../../../../src/lib/services/chain/BlockService');

describe('ChartService', () => {
      describe('getDatasetFromRange', () => {
        it('should call BlockService.getHashesByRange with correct arguments', async () => {
            const startTime = 1000;
            const endTime = 2000;
            await ChartService.getDatasetFromDateRange(startTime, endTime);
            expect(BlockService.getHashesByRange).toHaveBeenCalledWith(startTime, endTime);
        });

        it('should return ServicePayload on success', async () => {
            const mockedPayload = { status: 200, data: { result: [] }, error: false };
            (BlockService.getHashesByRange as jest.Mock).mockResolvedValueOnce(Payload.withSuccess(mockedPayload.data));
            const result = await ChartService.getDatasetFromDateRange(1000, 2000);
            expect(result).toMatchObject<any>([]);
        });

        it('should return error payload on failure', async () => {
            (BlockService.getHashesByRange as jest.Mock).mockResolvedValueOnce(Payload.withError());
            const result = await ChartService.getDatasetFromDateRange(1000, 2000);
            expect(result).toBe(undefined);
        });
    });

    describe('dataRange', () => {
        it('should generate correct date ranges for basic range input', () => {
            const highDate = new Date('2024-05-10T00:30:00Z');
            const lowDate = new Date('2024-05-10T00:00:00Z');
            const generator = ChartService.createRangeInDate(highDate, lowDate, 10);

            const expectedRanges = [
                { start: new Date('2024-05-10T00:10:00Z'), end: new Date('2024-05-10T00:00:00Z') },
                { start: new Date('2024-05-10T00:20:00Z'), end: new Date('2024-05-10T00:10:00Z') },
                { start: new Date('2024-05-10T00:30:00Z'), end: new Date('2024-05-10T00:20:00Z') },
            ];

            for (const expectedRange of expectedRanges) {
                const { value, done } = generator.next();
                expect(done).toBe(false);
                expect(value.start).toEqual(parseInt(expectedRange.start.getTime().toString().slice(0, 10)));
                expect(value.end).toEqual(parseInt(expectedRange.end.getTime().toString().slice(0, 10)));
            }

            expect(generator.next().done).toBe(true);
        });

        it('should generate correct date ranges when lower date minute is higher than the expected step', () => {
            const highDate = new Date('2024-05-10T00:30:00Z');
            const lowDate = new Date('2024-05-10T00:11:00Z');
            const generator = ChartService.createRangeInDate(highDate, lowDate, 10);

            const expectedRanges = [
                { start: new Date('2024-05-10T00:20:00Z'), end: new Date('2024-05-10T00:10:00Z') },
                { start: new Date('2024-05-10T00:30:00Z'), end: new Date('2024-05-10T00:20:00Z') },
            ];

            for (const expectedRange of expectedRanges) {
                const { value, done } = generator.next();
                expect(done).toBe(false);
                expect(value.start).toEqual(parseInt(expectedRange.start.getTime().toString().slice(0, 10)));
                expect(value.end).toEqual(parseInt(expectedRange.end.getTime().toString().slice(0, 10)));
            }

            expect(generator.next().done).toBe(true);
        });

        it('should generate correct date ranges when lower date minute is twice higher than the expected step', () => {
            const highDate = new Date('2024-05-10T00:30:00Z');
            const lowDate = new Date('2024-05-10T00:21:00Z');
            const generator = ChartService.createRangeInDate(highDate, lowDate, 10);

            const expectedRanges = [
                { start: new Date('2024-05-10T00:30:00Z'), end: new Date('2024-05-10T00:20:00Z') },
            ];

            for (const expectedRange of expectedRanges) {
                const { value, done } = generator.next();
                expect(done).toBe(false);
                expect(value.start).toEqual(parseInt(expectedRange.start.getTime().toString().slice(0, 10)));
                expect(value.end).toEqual(parseInt(expectedRange.end.getTime().toString().slice(0, 10)));
            }

            expect(generator.next().done).toBe(true);
        });

        it('should generate correct date ranges when lower date minute is lower than the expected step', () => {
            const highDate = new Date('2024-05-10T00:30:00Z');
            const lowDate = new Date('2024-05-10T00:09:00Z');
            const generator = ChartService.createRangeInDate(highDate, lowDate, 10);

            const expectedRanges = [
                { start: new Date('2024-05-10T00:10:00Z'), end: new Date('2024-05-10T00:00:00Z') },
                { start: new Date('2024-05-10T00:20:00Z'), end: new Date('2024-05-10T00:10:00Z') },
                { start: new Date('2024-05-10T00:30:00Z'), end: new Date('2024-05-10T00:20:00Z') },
            ];

            for (const expectedRange of expectedRanges) {
                const { value, done } = generator.next();
                expect(done).toBe(false);
                expect(value.start).toEqual(parseInt(expectedRange.start.getTime().toString().slice(0, 10)));
                expect(value.end).toEqual(parseInt(expectedRange.end.getTime().toString().slice(0, 10)));
            }

            expect(generator.next().done).toBe(true);
        });

        //TODO improve the description
        it('should generate end date higher than highDate as last value', () => {
            const highDate = new Date('2024-05-10T00:30:00Z');
            const lowDate = new Date('2024-05-10T00:00:00Z');
            const generator = ChartService.createRangeInDate(highDate, lowDate, 25);

            const expectedRanges = [
                { start: new Date('2024-05-10T00:25:00Z'), end: new Date('2024-05-10T00:00:00Z') },
                { start: new Date('2024-05-10T00:50:00Z'), end: new Date('2024-05-10T00:25:00Z') },
            ];

            for (const expectedRange of expectedRanges) {
                const { value, done } = generator.next();
                expect(done).toBe(false);
                expect(value.start).toEqual(parseInt(expectedRange.start.getTime().toString().slice(0, 10)));
                expect(value.end).toEqual(parseInt(expectedRange.end.getTime().toString().slice(0, 10)));
            }

            expect(generator.next().done).toBe(true);
        });

        it('should throw an error for lower highDate', () => {
            const lowDate = new Date('2024-05-10T00:30:00Z');
            const highDate = new Date('2024-05-10T00:00:00Z');
            try {
                ChartService.createRangeInDate(highDate, lowDate, 10)
            } catch (e) {
                expect(e).toThrow();
            }
        });

        it('should throw an error for invalid stepInMinutes', () => {
            const highDate = new Date('2024-05-10T00:30:00Z');
            const lowDate = new Date('2024-05-10T00:00:00Z');
            try {
                ChartService.createRangeInDate(highDate, lowDate, -1)
            } catch (e) {
                expect(e).toThrow();
            }
        });

    });
});
