import { IsInt, IsNotEmpty, MaxLength, MinLength } from "class-validator"
import { Status } from "../enum/status.enum"

export class PurchaseParentDto{
    @MinLength(4)
    @MaxLength(10)
    title:string

    @IsInt()
    price: number

    @IsNotEmpty()
    status: Status
}