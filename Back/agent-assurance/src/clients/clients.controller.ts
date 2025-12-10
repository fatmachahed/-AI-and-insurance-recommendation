// src/clients/clients.controller.ts
import { Controller, Get, Post } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('import')
  async importClients() {
    return this.clientsService.importFromExcel('./data/clients.xlsx');
  }

//   @Get('import')
// async testImport() {
//   return this.clientsService.importFromExcel('./data/clients.xlsx');
// }

    // Route GET temporaire
  @Get('test')
  getTest() {
    return { message: 'Backend fonctionne et DB connectée !' };
  }
}
