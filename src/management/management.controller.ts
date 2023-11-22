import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ManagementService } from './management.service';
import { PurchaseDto, UpdateQueryDto } from 'src/database/dto/purchase.dto';
import { PurchaseValidationPipe } from 'src/pipes/purchase-validation/purchase-validation.pipe';
import { StatusValidationPipe } from 'src/pipes/status-validation/status-validation.pipe';
import { Fuel } from 'src/database/entity/fuel.entity';
import { Tool } from 'src/database/entity/tool.entity';
import { ManagerGuard } from 'src/manager-guard/manager.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('management')
export class ManagementController {
    constructor(private managementService:ManagementService){}

    @Patch(':id')
    @UseGuards(AuthGuard(),ManagerGuard)
    async updatePurchaseStatus(
        @Param('id') id:number,
        @Query(
            PurchaseValidationPipe,
            StatusValidationPipe
        ) updateQueryDto: UpdateQueryDto
        ):Promise<void>{
        return this.managementService.updatePurchaseStatus(id,updateQueryDto)
    }

    @Delete(':id')
    @UseGuards(AuthGuard(),ManagerGuard)
    async deletePurchase(
        @Param('id') id:number,
        @Query(PurchaseValidationPipe) purchaseDto:PurchaseDto
    ):Promise<void>{
        return this.managementService.deletePurchase(id,purchaseDto)
    }

    @Get()
    async getFromDate(
        @Body('date') date:Date,
        @Query(PurchaseValidationPipe) purchaseDto:PurchaseDto
    ):Promise<Array<Fuel|Tool>>{
        return this.managementService.getFromDate(new Date(date),purchaseDto)
    }
}