import { PurchaseType } from "../enum/purchase-type.enum"
import { Status } from "../enum/status.enum"

export interface QueryDto{
    page: number
    count: number
    type: PurchaseType
    search: string
    status: Status
}