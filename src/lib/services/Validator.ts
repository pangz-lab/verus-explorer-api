export enum AddressType {
    rAddress,
    iAddress,
    zAddress,
    unknown
}

export class TransactionValidator {
    static isValidHash(input: string): boolean {
        const regex = /^[a-zA-Z0-9]+$/;
        return regex.test(input);
    }
}

export class IdentityValidator {
    static isValidVerusId(input: string): boolean {
        const regex = /^[^/:*?"<>|@.]+$/;
        return regex.test(input);
    }
    
    static isValidTxHash(input: string): boolean {
        const regex = /^[a-zA-Z0-9]+$/;
        return regex.test(input);
    }
}

export class AddressValidator {
    static getType(input: string): AddressType {
        if(input.length == 34) {
            if(input.startsWith('R')) { return AddressType.rAddress; }
            if(input.startsWith('i')) { return AddressType.iAddress; }
        }
        
        if(input.length <= 100 && input.startsWith('zs')) {
            return AddressType.zAddress;
        }

        return AddressType.unknown;
    }
}