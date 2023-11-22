import { Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelDto } from 'src/database/dto/fuel.dto';
import { ToolDto } from 'src/database/dto/tool.dto';
import { Employee } from 'src/database/entity/employee.entity';
import { Fuel } from 'src/database/entity/fuel.entity';
import { Tool } from 'src/database/entity/tool.entity';
import { PurchaseType } from 'src/database/enum/purchase-type.enum';
import { Status } from 'src/database/enum/status.enum';
import { Equal, Like, Repository } from 'typeorm';
import { toUpper } from 'lodash'
import { QueryDto } from 'src/database/dto/query.dto';
import { deletePhoto } from 'src/functions/functions';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectRepository(Tool) private toolRepository:Repository<Tool>,
        @InjectRepository(Fuel) private fuelRepository:Repository<Fuel>
        ){}

    async addTool(emp:Employee,toolDto:ToolDto,receipt:string):Promise<Tool>{
        const tool = new Tool(
            toolDto.title,
            toolDto.price,
            receipt,
            toUpper(toolDto.status),
            toolDto.description,
            emp
        )
        try{
            await this.toolRepository.save(tool)
            delete tool.employee
            return tool
        }catch(err){
            console.log(err)
            deletePhoto(receipt)
            throw new InternalServerErrorException()
        }
    }

    async addFuel(emp:Employee,fuelDto:FuelDto,receipt:string):Promise<Fuel>{
        const fuel = new Fuel(
            fuelDto.title,
            fuelDto.price,
            receipt,
            toUpper(fuelDto.status),
            fuelDto.start,
            fuelDto.end,
            emp)
        try{
            const query = this.fuelRepository.createQueryBuilder('fuel')
            await query.insert().into('fuel').values(fuel).execute()
            delete fuel.employee
            return fuel
        }catch(err){
            console.log(err)
            deletePhoto(receipt)
            throw new InternalServerErrorException()
        }
    }

    async modifyPurchase(
        id:number,
        emp:Employee,
        purchase: FuelDto|ToolDto,
        receipt:string,
        type:PurchaseType
        ):Promise<Fuel|Tool>{
            if(type == PurchaseType.fuel){
                const query = this.fuelRepository.createQueryBuilder('fuel')
                const fuel = await query.leftJoin("fuel.employee","employee")
                                        .where("employee.id = :id",{id:emp.id})
                                        .andWhere({id})
                                        .getOne()
                if(!fuel){
                    throw new NotFoundException()
                }
                if(toUpper(fuel.status) == Status.approved){
                    throw new NotAcceptableException('no modification, already accepted from manager')
                }
                try{
                    const updatedFuel = await this.fuelRepository.save({...fuel,...purchase,receipt})
                    return updatedFuel
                }catch(err){
                    console.log(err)
                    deletePhoto(receipt)
                    throw new InternalServerErrorException()
                }
            }
            const tool = await this.toolRepository.findOne({where:{id,employee:Equal(emp.id)}})
            if(!tool){
                throw new NotFoundException()
            }
            if(toUpper(tool.status) == Status.approved){
                throw new NotAcceptableException('no modification, already accepted from manager')
            }
            try{
                const updatedTool = await this.toolRepository.save({...tool,...purchase,receipt})
                return updatedTool
            }catch(err){
                console.log(err)
                deletePhoto(receipt)
                throw new InternalServerErrorException()
            }
    }

    async deletePurchase(id:number,emp: Employee,type:PurchaseType){
        if(type == PurchaseType.fuel){
            const fuel = await this.fuelRepository.findOne({where:{id,employee:Equal(emp.id)}})
            if(!fuel){
                throw new NotFoundException()
            }
            if(toUpper(fuel.status) == Status.approved){
                throw new NotAcceptableException('can\'t delete, already accepted from manager')
            }
            await this.fuelRepository.delete({id})
            deletePhoto(fuel.receipt)
            return
        }
        const tool = await this.toolRepository.findOne({where:{id,employee:Equal(emp.id)}})
        if(!tool){
            throw new NotFoundException()
        }
        if(toUpper(tool.status) == Status.approved){
            throw new NotAcceptableException('can\'t delete, already accepted from manager')
        }
        await this.toolRepository.remove(tool)
        deletePhoto(tool.receipt)
    }

    async getPurchase(emp:Employee,id:number,type:PurchaseType):Promise<Fuel|Tool>{
        if(type == PurchaseType.fuel){
            const fuel = await this.fuelRepository.findOne({
                where:{
                    id,
                    employee:Equal(emp.id)
                },relations:{
                    employee:true
                }
            })
            if(!fuel){
                throw new NotFoundException()
            }
            delete fuel.employee.password
            return fuel
        }
        const query = this.toolRepository.createQueryBuilder('tool')
        const tool = await query.leftJoinAndSelect("tool.employee","employee")
                                        .where("employee.id = :id",{id:emp.id})
                                        .andWhere({id})
                                        .getOne()
        if(!tool){
            throw new NotFoundException()
        }
        delete tool.employee.password
        return tool
    }

    async getPurchases(emp:Employee,queryDto:QueryDto):Promise<Array<Fuel|Tool>>{
        const {page,count,type,search,status} = queryDto
        if(toUpper(type) == PurchaseType.fuel){
            const fuel = await this.fuelRepository.find({where:{
                title: Like(`%${search}%`),
                status: toUpper(status),
                employee: Equal(emp.id)
            },
            skip:(page-1)*count,
            take:count
        })
            return fuel
        }
        const query = await this.toolRepository.createQueryBuilder('tool')
        const tool = await query.where({
            title: Like(`%${search}%`),
            status: status,
            employee: Equal(emp.id)
        }).skip((page-1)*count)
        .take(count)
        .getMany()
        return tool
    }
}