import { Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tool } from 'src/database/entity/tool.entity';
import { Fuel } from 'src/database/entity/fuel.entity';
import { MulterModule } from '@nestjs/platform-express';
import * as config from 'config'

const jwt = config.get('jwt')
@Module({
  
  imports:[
    PassportModule.register({defaultStrategy: jwt.strategy}),
    TypeOrmModule.forFeature([Tool,Fuel]),
    MulterModule.register({
      dest: './uploads'
    })
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService]
})
export class PurchaseModule {}
