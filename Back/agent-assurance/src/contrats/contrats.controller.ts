import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { ContratsService } from './contrats.service';
import { CreateContratDto } from './dto/create-contrat.dto';
import { UpdateContratDto } from './dto/update-contrat.dto';
import { Contrat } from './entities/contrat.entity';

@Controller('contrats')
export class ContratsController {
  constructor(private readonly contratsService: ContratsService) {}

  @Post()
  create(@Body() createContratDto: CreateContratDto): Promise<Contrat> {
    return this.contratsService.create(createContratDto);
  }

  @Get()
  findAll(): Promise<Contrat[]> {
    return this.contratsService.findAll();
  }

  @Get('client/:refPersonne')
  findByRefPersonne(@Param('refPersonne') refPersonne: string): Promise<Contrat[]> {
    return this.contratsService.findByRefPersonne(refPersonne);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Contrat> {
    const contrat = await this.contratsService.findOne(+id);
    
    if (!contrat) {
      throw new NotFoundException(`Contrat avec l'ID ${id} non trouvé`);
    }
    
    return contrat;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateContratDto: UpdateContratDto): Promise<Contrat> {
    const contrat = await this.contratsService.update(+id, updateContratDto);
    
    if (!contrat) {
      throw new NotFoundException(`Contrat avec l'ID ${id} non trouvé`);
    }
    
    return contrat;
  }


}