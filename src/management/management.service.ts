import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseDto, UpdateQueryDto } from 'src/database/dto/purchase.dto';
import { Tool } from 'src/database/entity/tool.entity';
import { PurchaseType } from 'src/database/enum/purchase-type.enum';
import { MoreThan, Repository } from 'typeorm';
import { toUpper } from 'lodash'
import { Fuel } from 'src/database/entity/fuel.entity';
import { deletePhoto } from 'src/functions/functions';

@Injectable()
export class ManagementService {
    constructor(
        @InjectRepository(Tool) private toolRepository:Repository<Tool>,
        @InjectRepository(Fuel) private fuelRepository:Repository<Fuel>
        ){}
    async updatePurchaseStatus(id:number,updateQueryDto:UpdateQueryDto){
        const {type,status} = updateQueryDto
        if(toUpper(type) == PurchaseType.fuel){
            const fuel = await this.fuelRepository.findOne({where:{id}})
            if(!fuel){
                throw new NotFoundException(`fuel with ID ${id} not found`)
            }
            fuel.status = toUpper(status)
            await this.fuelRepository.save(fuel)
        }
        const query = this.toolRepository.createQueryBuilder('tool')
        const tool = await query.where({id}).getOne()
        if(!tool){
            throw new NotFoundException(`fuel with ID ${id} not found`)
        }
        await query.update(tool).set({status:toUpper(status)}).execute()
    }

    async deletePurchase(id:number,purchaseDto:PurchaseDto){
        const { type } = purchaseDto
        if(toUpper(type) == PurchaseType.fuel){
            const fuel = await this.fuelRepository.findOne({where:{id}})
            if(!fuel){
                throw new NotFoundException()
            }
            await this.fuelRepository.remove(fuel)
            deletePhoto(fuel.receipt) //delete photo from storage
        }
        const query = this.toolRepository.createQueryBuilder('tool')
        const tool = await query.where({id}).getOne()
        if(!tool){
            throw new NotFoundException()
        }
        await this.toolRepository.remove(tool)
        deletePhoto(tool.receipt) //delete photo from storage
    }

    async getFromDate(date:Date,purchaseDto:PurchaseDto):Promise<Array<Fuel|Tool>>{
        const { type } = purchaseDto
        var tool, fuel, query
        if(!date && toUpper(type)==PurchaseType.fuel){
            fuel = await this.fuelRepository.find({relations:{employee:true}})
            return fuel
        }else if(date && toUpper(type)==PurchaseType.fuel){
            fuel = await this.fuelRepository.find(
                {
                    where:{created_at: MoreThan(date)},
                    relations:{employee:true}
                })
            return fuel
        }else if(!date && toUpper(type)==PurchaseType.tool){
            query = await this.toolRepository.createQueryBuilder('tool')
            tool = await query.leftJoinAndSelect("tool.employee","employee").getMany()
            return tool
        }else{
        query = await this.toolRepository.createQueryBuilder('tool')
        tool = await query.leftJoinAndSelect("tool.employee","employee").where({created_at: MoreThan(date)}).getMany()
        return tool
        }
    }
}