import { Role } from "../entity/role.entity"
import { Title } from "../enum/title.enum"
import { IsEmail, IsInt, IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class PersonDto{
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string

    @MinLength(5)
    @MaxLength(15)
    title: Title
}

export class EmployeeDto extends PersonDto {
    @IsNotEmpty()
    @IsInt()
    roleId: Role
}

export class ManagerDto extends PersonDto {}