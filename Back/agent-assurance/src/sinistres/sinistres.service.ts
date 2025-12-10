import { Injectable } from '@nestjs/common';
import { CreateSinistreDto } from './dto/create-sinistre.dto';
import { UpdateSinistreDto } from './dto/update-sinistre.dto';

@Injectable()
export class SinistresService {
  create(createSinistreDto: CreateSinistreDto) {
    return 'This action adds a new sinistre';
  }

  findAll() {
    return `This action returns all sinistres`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sinistre`;
  }

  update(id: number, updateSinistreDto: UpdateSinistreDto) {
    return `This action updates a #${id} sinistre`;
  }

  remove(id: number) {
    return `This action removes a #${id} sinistre`;
  }
}
