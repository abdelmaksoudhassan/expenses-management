import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/database/entity/employee.entity';
import { Manager } from 'src/database/entity/manager.entity';
import { JwtStrategy } from './jwt/jwt-strategy.class';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import * as config from 'config'

const jwtConfig = config.get('jwt')

@Module({
  imports:[
    HttpModule,
    TypeOrmModule.forFeature([Employee,Manager]),
    PassportModule.register({defaultStrategy: jwtConfig.strategy}),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions:{
        expiresIn: jwtConfig.expiresIn
      }
    })
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService,JwtStrategy],
  // exports:[JwtStrategy,PassportModule]
})
export class AuthenticationModule {}
