/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TiketModule } from './tiket/tiket.module';

@Module({
  imports: [TiketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
