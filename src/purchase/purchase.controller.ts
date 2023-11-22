import { Controller,Post, UseGuards, Body, Patch, Param, Query, Delete, Get, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { GetUser } from 'src/decorators/get-person/get-person.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Employee } from 'src/database/entity/employee.entity';
import { ToolDto } from 'src/database/dto/tool.dto';
import { Tool } from 'src/database/entity/tool.entity';
import { Fuel } from 'src/database/entity/fuel.entity';
import { FuelDto } from 'src/database/dto/fuel.dto';
import { toUpper } from 'lodash'
import { PurchaseValidationPipe } from 'src/pipes/purchase-validation/purchase-validation.pipe';
import { QueryDto } from 'src/database/dto/query.dto';
import { PurchaseDto } from 'src/database/dto/purchase.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterPipe } from 'src/pipes/multer-pipe/multer-pipe';

@Controller('purchase')
export class PurchaseController {
    constructor(private purchaseService:PurchaseService){}

    @Post('add-tool')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('receipt'))
    async addPurshase(
        @GetUser() emp:Employee,
        @Body() toolDto:ToolDto,
        @UploadedFile(MulterPipe) file:Express.Multer.File
        ):Promise<Tool>{
            const receipt = file.path
            return this.purchaseService.addTool(emp,toolDto,receipt)
    }

    @Post('add-fuel')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('receipt'))
    async addFuel(
        @GetUser() emp:Employee,
        @Body() fuelDto:FuelDto,
        @UploadedFile(MulterPipe) file:Express.Multer.File
        ):Promise<Fuel>{
            const receipt = file.path
            return this.purchaseService.addFuel(emp,fuelDto,receipt)
    }

    @Patch('modify-purchase/:id')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('receipt'))
    async modifyPurchase(
        @GetUser() emp:Employee,
        @Body() purchase:FuelDto|ToolDto,
        @UploadedFile(MulterPipe) file:Express.Multer.File,
        @Param('id') id:number,
        @Query(PurchaseValidationPipe) query:PurchaseDto
        ):Promise<Fuel | Tool>{
            const receipt = file.path
            return this.purchaseService.modifyPurchase(id, emp, purchase,receipt, toUpper(query.type))
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    deletePurchase(
        @GetUser() emp:Employee,
        @Param('id') id:number,
        @Query(PurchaseValidationPipe) query:PurchaseDto
        ){
        return this.purchaseService.deletePurchase(id, emp, toUpper(query.type))
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    async getPurchase(
        @GetUser() emp:Employee,
        @Param('id') id:number,
        @Query(PurchaseValidationPipe) query: PurchaseDto
    ):Promise<Fuel|Tool>{
        return this.purchaseService.getPurchase(emp,id,toUpper(query.type))
    }

    @Get()
    @UseGuards(AuthGuard())
    async getPurchases(
        @GetUser() emp:Employee,
        @Query(PurchaseValidationPipe) queryDto:QueryDto
    ):Promise<Array<Fuel|Tool>>{
        return this.purchaseService.getPurchases(emp,queryDto)
    }
}