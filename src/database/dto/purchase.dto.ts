import { PurchaseType } from "../enum/purchase-type.enum";
import { Status } from "../enum/status.enum";

export interface PurchaseDto{
    type: PurchaseType
}

export interface UpdateQueryDto extends PurchaseDto{
    status: Status
}