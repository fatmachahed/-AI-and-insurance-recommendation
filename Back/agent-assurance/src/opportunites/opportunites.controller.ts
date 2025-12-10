import { Controller, Get, Param, Post, Body, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { OpportunitesService } from './opportunites.service';
import { CreateOpportuniteDto } from './dto/create-opportunite.dto';
import { UpdateOpportuniteDto } from './dto/update-opportunite.dto';

@Controller('opportunites')
export class OpportunitesController {
  constructor(private readonly opportunitesService: OpportunitesService) {}

  @Post()
  create(@Body() createOpportuniteDto: CreateOpportuniteDto) {
    return this.opportunitesService.create(createOpportuniteDto);
  }

  @Get()
  findAll() {
    return this.opportunitesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.opportunitesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOpportuniteDto: UpdateOpportuniteDto) {
    return this.opportunitesService.update(id, updateOpportuniteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.opportunitesService.remove(id);
  }

  // ✅ Nouvelle route pour récupérer les recommandations d’un client
  @Get('client/:ref')
  findByClient(@Param('ref') ref: string) {
    return this.opportunitesService.findByClient(ref);
  }
}
