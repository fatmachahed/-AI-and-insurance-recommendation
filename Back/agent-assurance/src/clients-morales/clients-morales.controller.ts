import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientsMoralesService } from './clients-morales.service';
import { CreateClientsMoraleDto } from './dto/create-clients-morale.dto';
import { UpdateClientsMoraleDto } from './dto/update-clients-morale.dto';

@Controller('clients-morales')
export class ClientsMoralesController {
  constructor(private readonly clientsMoralesService: ClientsMoralesService) {}

  @Post()
  create(@Body() createClientsMoraleDto: CreateClientsMoraleDto) {
    return this.clientsMoralesService.create(createClientsMoraleDto);
  }

  @Get()
  findAll() {
    return this.clientsMoralesService.findAll();
  }

    @Get(':ref_personne')
  findOne(@Param('ref_personne') ref_personne: string) {
    return this.clientsMoralesService.findOne(ref_personne);
  }

}
