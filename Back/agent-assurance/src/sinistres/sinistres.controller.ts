import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SinistresService } from './sinistres.service';
import { CreateSinistreDto } from './dto/create-sinistre.dto';
import { UpdateSinistreDto } from './dto/update-sinistre.dto';

@Controller('sinistres')
export class SinistresController {
  constructor(private readonly sinistresService: SinistresService) {}

  @Post()
  create(@Body() createSinistreDto: CreateSinistreDto) {
    return this.sinistresService.create(createSinistreDto);
  }

  @Get()
  findAll() {
    return this.sinistresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sinistresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSinistreDto: UpdateSinistreDto) {
    return this.sinistresService.update(+id, updateSinistreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sinistresService.remove(+id);
  }
}
