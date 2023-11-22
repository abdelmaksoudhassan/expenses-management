import { MaxLength, MinLength } from "class-validator"
import { PurchaseParentDto } from "./purchase.parent.dto"

export class ToolDto extends PurchaseParentDto{
    @MinLength(6)
    @MaxLength(20)
    description: string
}