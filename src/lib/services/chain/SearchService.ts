import { Payload, ServicePayload } from "../Payload";
import { AddressType, AddressValidator, IdentityValidator } from "../Validator";
import { TransactionService } from "./TransactionService";

export enum QueryValueType {
    unknown = "0",
    verusId = "verusId",
    block = "block",
    address = "address",
    blockHash = "blockHash",
    txHash = "txHash",
}

export class SearchService {
    static async findQuery(q: string): Promise<ServicePayload> {
        var result = {
            type: QueryValueType.unknown,
            value: q,
            valid: false,
        };

        try {
            q = q.trim();
            const lastChar = q.charAt(q.length - 1);
            var data: any;

            if(q.length > 80) { return Payload.withError(result); }
            
            if (lastChar === '@') {
                if(!IdentityValidator.isValidVerusId(q.slice(0, -1))) {
                    return Payload.withError(result);
                }
                
                result.type = QueryValueType.verusId;
                result.valid = true;
                return Payload.withSuccess(result);
            }

            const type = AddressValidator.getType(q)
            if([AddressType.iAddress, AddressType.zAddress, AddressType.rAddress].includes(type)) {
                result.type = QueryValueType.address;
                result.valid = true;
                return Payload.withSuccess(result);
            }

            if(q.length <= 80 && IdentityValidator.isValidTxHash(q)) {
                data = await TransactionService.getInfo(q);
                result.type = (!data.error)? 
                    QueryValueType.txHash : 
                    (q.length < 12)? 
                        QueryValueType.block :
                        QueryValueType.blockHash;
                result.valid = true;
                return Payload.withSuccess(result);
            }

            return Payload.withError(result);
        } catch(e) {
            Payload.logError(
                'search info - [Exception] : ' + e,
                `Query: ${q}`,
                `findQuery`);
            return Payload.withError(result);
        }
    }
}