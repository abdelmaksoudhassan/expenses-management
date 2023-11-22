import { PurchaseParentDto } from "./purchase.parent.dto"
import { IsInt } from 'class-validator'

export class FuelDto extends PurchaseParentDto{
    @IsInt()
    start: number

    @IsInt()
    end: number
}