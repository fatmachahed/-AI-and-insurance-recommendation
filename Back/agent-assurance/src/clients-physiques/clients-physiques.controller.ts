import { Controller, Get, Param } from '@nestjs/common';
import { ClientsPhysiquesService } from './clients-physiques.service';
import { ClientPhysique } from './entities/clients-physique.entity';

@Controller('clients-physiques')
export class ClientsPhysiquesController {
  constructor(private readonly clientsPhysiquesService: ClientsPhysiquesService) {}

  @Get()
  async findAll(): Promise<ClientPhysique[]> {
    return this.clientsPhysiquesService.findAll();
  }

  @Get(':ref_personne')
  async findOne(@Param('ref_personne') ref_personne: string): Promise<ClientPhysique> {
    return this.clientsPhysiquesService.findOne(ref_personne);
  }
}