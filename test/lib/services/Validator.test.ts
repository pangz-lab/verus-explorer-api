import {
    AddressType,
    TransactionValidator,
    IdentityValidator,
    AddressValidator
} from '../../../src/lib/services/Validator';

describe('TransactionValidator', () => {
    it('should return true for valid hash', () => {
        const validHash = '000000000005dcf02e4a2e64989585c4e4f3762f94783917193b920cfb4f9577';
        expect(TransactionValidator.isValidHash(validHash)).toBe(true);
    });

    it('should return false for invalid hash', () => {
        var invalidHash = 'abc@123';
        expect(TransactionValidator.isValidHash(invalidHash)).toBe(false);
        invalidHash = '<script></script>';
        expect(TransactionValidator.isValidHash(invalidHash)).toBe(false);
        invalidHash = '& 1 == 1';
        expect(TransactionValidator.isValidHash(invalidHash)).toBe(false);
    });
});

describe('IdentityValidator', () => {
    it('should return true for valid VerusID', () => {
        const validVerusId = 'Verus Foundation';
        expect(IdentityValidator.isValidVerusId(validVerusId)).toBe(true);
    });
    
    it('should return true for valid VerusID with emojis', () => {
        const validVerusId = '😇🙂🙃😉😌';
        expect(IdentityValidator.isValidVerusId(validVerusId)).toBe(true);
    });
    
    it('should return true for valid VerusID with wingdings', () => {
        const validVerusId = '⮳🞈🞈';
        expect(IdentityValidator.isValidVerusId(validVerusId)).toBe(true);
    });
    
    it('should return true for valid VerusID with wingings 2', () => {
        const validVerusId = '⑧❺';
        expect(IdentityValidator.isValidVerusId(validVerusId)).toBe(true);
    });
    
    it('should return true for valid VerusID with wingings 3', () => {
        const validVerusId = '␣⌤';
        expect(IdentityValidator.isValidVerusId(validVerusId)).toBe(true);
    });

    it('should return true for valid VerusID with Dingbats', () => {
        const validVerusId = '✼ ✽ ✾ ✿🙴🙺🙾';
        expect(IdentityValidator.isValidVerusId(validVerusId)).toBe(true);
    });
    
    it('should return true for valid VerusID with Webdings', () => {
        const validVerusId = '🚍︎⛳︎';
        expect(IdentityValidator.isValidVerusId(validVerusId)).toBe(true);
    });

    it('should return false for invalid VerusID containing invalid characters', () => {
        const invalidVerusId = 'test@ID';
        expect(IdentityValidator.isValidVerusId(invalidVerusId)).toBe(false);
    });

    it('should return true for valid transaction hash', () => {
        const validTxHash = '000000000005dcf02e4a2e64989585c4e4f3762f94783917193b920cfb4f9577';
        expect(IdentityValidator.isValidTxHash(validTxHash)).toBe(true);
    });

    it('should return false for invalid transaction hash', () => {
        const invalidTxHash = 'abc@123';
        expect(IdentityValidator.isValidTxHash(invalidTxHash)).toBe(false);
    });
});

describe('AddressValidator', () => {
    it('should return AddressType.rAddress for valid R-address', () => {
        const rAddress = 'RPbh4m7KR7A4jQpHraakvCiY6sbJS8PCkk';
        expect(AddressValidator.getType(rAddress)).toBe(AddressType.rAddress);
    });

    it('should return AddressType.iAddress for valid i-address', () => {
        const iAddress = 'i4NpJp1vqrXgDvSNBXkNYvTR1VF2HMkeDA';
        expect(AddressValidator.getType(iAddress)).toBe(AddressType.iAddress);
    });

    it('should return AddressType.zAddress for valid z-address', () => {
        const zAddress = 'zs1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567';
        expect(AddressValidator.getType(zAddress)).toBe(AddressType.zAddress);
    });

    it('should return AddressType.unknown for unknown address type', () => {
        const unknownAddress = 'invalidAddress';
        expect(AddressValidator.getType(unknownAddress)).toBe(AddressType.unknown);
    });
    
    it('should return AddressType.unknown for value longer than 100', () => {
        const unknownAddress = 'zsnvalidAddresssinvalidAddresssinvalidAddresssinvalidAddresssinvalidAddresssinvalidAddresssinvalidAdd';
        expect(AddressValidator.getType(unknownAddress)).toBe(AddressType.unknown);
    });
});
