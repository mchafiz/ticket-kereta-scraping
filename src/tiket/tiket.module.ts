/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TicketController } from './tiket.controller';
import { TicketService } from './tiket.service';


@Module({
  controllers: [TicketController],
  providers: [TicketService]
})
export class TiketModule { }
