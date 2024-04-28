import crypto from 'crypto';

export class Hashing {
    static createChecksum(value: string, algo?: string): string {
        return (crypto.createHash(algo ?? 'sha1'))
            .update(value)
            .digest('hex');
    }
}