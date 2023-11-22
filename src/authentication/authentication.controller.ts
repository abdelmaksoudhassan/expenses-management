import { Body, Controller, Delete, Post, Query, Res, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { EmployeeDto, ManagerDto, PersonDto } from '../database/dto/person.dto';
import { TitleValidationPipe } from 'src/pipes/title-validation/title-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorators/get-person/get-person.decorator';
import { RequestHeader } from 'src/decorators/rquest-header/rquest-header.decorator';
import { DeleteType } from 'src/database/enum/delete-type.enum';
import { Person } from 'src/database/entity/person.parent';
import { Title } from 'src/database/enum/title.enum';
import { Response } from 'express'

@Controller('authentication')
export class AuthenticationController {
    constructor(private authenticationService:AuthenticationService){}
    
    @Post('signup')
    async signup(@Body(TitleValidationPipe) personDto:ManagerDto|EmployeeDto):Promise<void>{
        return this.authenticationService.signup(personDto)
    }

    @Post('signin')
    async signin(
        @Body(TitleValidationPipe) personDto:PersonDto,
        @Res({passthrough: true}) response:Response){
            const token = await this.authenticationService.signin(personDto)
            response.cookie('token',token,{httpOnly:true})
    }

    @Delete('delete-account')
    @UseGuards(AuthGuard())
    async deleteAccount(
        @GetUser() person:Person,
        @RequestHeader() deleteType:string,
        @Query(TitleValidationPipe) title:Title
    ):Promise<void>{
        if(deleteType == DeleteType.soft){
            return this.authenticationService.softDeleteAccount(person.id,title['title'])
        }
        return this.authenticationService.deleteAccount(person.id,title['title'])
    }

    @Post('restore-account')
    async restoreAccount(
        @Body('email') email:string,
        @Query(TitleValidationPipe) title:Title
    ):Promise<void>{
        return this.authenticationService.restoreAccount(email,title['title'])
    }
}