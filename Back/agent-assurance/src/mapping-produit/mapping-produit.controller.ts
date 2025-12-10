import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MappingProduitService } from './mapping-produit.service';
import { CreateMappingProduitDto } from './dto/create-mapping-produit.dto';
import { UpdateMappingProduitDto } from './dto/update-mapping-produit.dto';

@Controller('mapping-produit')
export class MappingProduitController {
  constructor(private readonly mappingProduitService: MappingProduitService) {}

  @Post()
  create(@Body() createMappingProduitDto: CreateMappingProduitDto) {
    return this.mappingProduitService.create(createMappingProduitDto);
  }

  @Get()
  findAll() {
    return this.mappingProduitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mappingProduitService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMappingProduitDto: UpdateMappingProduitDto) {
    return this.mappingProduitService.update(+id, updateMappingProduitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mappingProduitService.remove(+id);
  }
}
