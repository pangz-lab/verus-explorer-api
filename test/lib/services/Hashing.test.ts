import crypto from 'crypto';
import { Hashing } from '../../../src/lib/services/Hashing';

jest.mock('crypto');

describe('Hashing', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create checksum using default algorithm (sha1)', () => {
        const value = 'test';
        const expectedChecksum = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'; // SHA1 hash of 'test'
        (crypto.createHash as jest.Mock).mockReturnValueOnce({
            update: jest.fn().mockReturnThis(),
            digest: jest.fn().mockReturnValueOnce(expectedChecksum)
        });
        const checksum = Hashing.createChecksum(value);
        expect(checksum).toBe(expectedChecksum);
        expect(crypto.createHash).toHaveBeenCalledWith('sha1');
    });

    it('should create checksum using provided algorithm', () => {
        const value = 'test';
        const algo = 'sha256';
        const expectedChecksum = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'; // SHA256 hash of 'test'
        (crypto.createHash as jest.Mock).mockReturnValueOnce({
            update: jest.fn().mockReturnThis(),
            digest: jest.fn().mockReturnValueOnce(expectedChecksum)
        });
        const checksum = Hashing.createChecksum(value, algo);
        expect(checksum).toBe(expectedChecksum);
        expect(crypto.createHash).toHaveBeenCalledWith(algo);
    });
});
