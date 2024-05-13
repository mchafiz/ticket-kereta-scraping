/* eslint-disable prettier/prettier */
import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { TicketService } from './tiket.service';


@Controller('ticket')
export class TicketController {
    constructor(private ticketService: TicketService) { }

    @Get('list')
    @HttpCode(200)
    getListTicket(
        @Query('from') from: string,
        @Query('to') to: string,
    ) {
        return this.ticketService.getListTicket({
            from,
            to
        });
    }

}
