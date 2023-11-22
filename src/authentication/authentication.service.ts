import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/database/entity/employee.entity';
import { Manager } from 'src/database/entity/manager.entity';
import { hashPassword, validatePassword } from 'src/functions/functions';
import { Repository } from 'typeorm';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { Title } from '../database/enum/title.enum';
import { EmployeeDto, ManagerDto, PersonDto } from '../database/dto/person.dto';
import { JwtService } from '@nestjs/jwt';
import { toUpper,toLower } from 'lodash'
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import {  isEmail } from 'class-validator';

@Injectable()
export class AuthenticationService {
    constructor(@InjectRepository(Employee) private employeeRepository:Repository<Employee>,
    @InjectRepository(Manager) private managerRepository:Repository<Manager>,
    private jwtService: JwtService,
    private readonly httpService: HttpService){}

    async validatePerson(jwtpayload:JwtPayload):Promise<any>{
        const {email,title} = jwtpayload
        if(toUpper(title) == Title.manager){
            const manager = await this.managerRepository.findOne({where:{email}})
            if(!manager){
                throw new UnauthorizedException()
            }
            return manager
        }
        const employee = await this.employeeRepository.findOne({where:{email},relations:{role:true}})
        if(!employee){
            throw new UnauthorizedException()
        }
        return employee
    }

    private async validateSigninData(personDto:PersonDto):Promise<any>{
        const {password,title} = personDto
        const email = toLower(personDto.email)
        if(toUpper(title) == Title.manager){
            const manager = await this.managerRepository.findOne({
                where:{email},
                select:[
                    ...this.managerRepository.metadata.columns.map(col=>(col.propertyName)) as (keyof Manager)[]
                ]
            })
            if(!manager){
                throw new NotFoundException(`${email} not found`)
            }
            const checked = await manager.checkPassword(password)
            if(! checked){
                throw new UnauthorizedException('wrong password')
            }
            delete manager.password
            return manager
        }
        const employee = await this.employeeRepository.findOne({
            where:{email},
            select:[
                ...this.employeeRepository.metadata.columns.map(col=>col.propertyName) as (keyof Employee)[]
            ]
        })
        if(!employee){
            throw new NotFoundException(`${email} not found`)
        }
        const checked = await employee.checkPassword(password)
        if(! checked){
            throw new UnauthorizedException('wrong password')
        }
        delete employee.password
        return employee
    }

    private async validateEmail(email:string,title:Title):Promise<any>{
        const payload:JwtPayload = {email,title}
        const token = await this.jwtService.sign(payload)
        const accessToken = `Bearer ${token}`
        const {data} = await firstValueFrom(this.httpService.post(
            `http://localhost:3000/mail`,{},{
            headers:{
                'Authorization': accessToken
            }
        }).pipe(catchError((error:AxiosError)=>{
                console.log(error.code,error.message)
                throw new UnauthorizedException()
            }))
        )
        return data
    }

    async signup(personDto:ManagerDto|EmployeeDto){
        const {password,title} = personDto
        const email = toLower(personDto.email)
        try{
            validatePassword(password)
            const hashedPassword = await hashPassword(password)
            if(personDto instanceof EmployeeDto){
                var {roleId} = personDto
            }
            if(toUpper(title) == Title.manager){
                const query = this.managerRepository.createQueryBuilder('manager')
                await query.insert().into('manager').values([{email,password: hashedPassword}]).execute()
            }else{
                const query = this.employeeRepository.createQueryBuilder('employee')
                await query.insert().into('employee').values([{email,password: hashedPassword,roleId}]).execute()
            }
            // const data = await this.validateEmail(email,title)
        }catch(error){
            if(error.code == 23505){
                throw new ConflictException(`${email} is already used`)
            }else{
                throw new InternalServerErrorException()
            }
        }
    }

    async signin(personDto:PersonDto):Promise<{token}>{
        const person = await this.validateSigninData(personDto)
        if(!person){
            throw new UnauthorizedException()
        }
        ////////////////////// JWT //////////////////////////////
        const { email ,title } = personDto
        const payload:JwtPayload = {email,title}
        const token = await this.jwtService.sign(payload)
        return {token}
    }

    async softDeleteAccount(id:number,title:string):Promise<void>{
        var query
        try{
            if(toUpper(title) == Title.manager){
                query = this.managerRepository.createQueryBuilder('manager')
                await query.softDelete().where('id = :id',{id}).execute()
            }else{
                query = this.employeeRepository.createQueryBuilder('employee')
                await query.softDelete().where('id = :id',{id}).execute()
            }
        }catch(err){
            throw new InternalServerErrorException()
        }
    }

    async deleteAccount(id:number,title:string):Promise<void>{
        var query
        try{
            if(toUpper(title) == Title.manager){
                query = this.managerRepository.createQueryBuilder('manager')
                await query.delete().from(Manager).where('id = :id',{id}).execute()
            }else{
                query = this.employeeRepository.createQueryBuilder('employee')
                await query.delete().from(Employee).where('id = :id',{id}).execute()
            }
        }catch(err){
            throw new InternalServerErrorException()
        }
    }

    async restoreAccount(email:string,title:string):Promise<void>{
        var query
        if(!email || !isEmail(email)){
            throw new BadRequestException()
        }
        try{
            if(toUpper(title) == Title.manager){
                query = this.managerRepository.createQueryBuilder('manager')
                await query.restore().where('email = :email',{email}).execute()
            }else{
                query = this.employeeRepository.createQueryBuilder('employee')
                await query.restore().where('email = :email',{email}).execute()
            }
        }catch(err){
            throw new InternalServerErrorException()
        }
    }
}