import { Module } from '@nestjs/common';
import { ManagementController } from './management.controller';
import { ManagementService } from './management.service';
import { Tool } from 'src/database/entity/tool.entity';
import { Fuel } from 'src/database/entity/fuel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import * as config from 'config'

const jwtConfig = config.get('jwt')

@Module({
  imports:[TypeOrmModule.forFeature([Tool,Fuel]),
  PassportModule.register({defaultStrategy: jwtConfig.strategy}),],
  controllers: [ManagementController],
  providers: [ManagementService]
})
export class ManagementModule {}
