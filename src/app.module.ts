import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/config/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { MailModule } from './mail/mail.module';
import { PurchaseModule } from './purchase/purchase.module';
import { ManagementModule } from './management/management.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthenticationModule,
    MailModule,
    PurchaseModule,
    ManagementModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads')
    }),
    MulterModule.register({
      dest: './uploads'
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}