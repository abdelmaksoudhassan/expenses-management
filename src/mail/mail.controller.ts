import { Controller, Post, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-person/get-person.decorator';

@Controller('mail')
export class MailController {
    constructor(private mailService: MailService){}

    @Post()
    @UseGuards(AuthGuard())
    async test(@GetUser() user:any):Promise<any>{
        return this.mailService.sendUserConfirmation(user.email)
    }
}