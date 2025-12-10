import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHistoriqueDto } from './dto/create-historique.dto';
import { UpdateHistoriqueDto } from './dto/update-historique.dto';
import { Historique } from '../historique/entities/historique.entity';


@Injectable()
export class HistoriqueService {
    constructor(
      @InjectRepository(Historique)
      private clientsRepo: Repository<Historique>,
    ) {}

  create(createHistoriqueDto: CreateHistoriqueDto) {
    return 'This action adds a new historique';
  }

  findAll(): Promise<Historique[]> {
    return this.clientsRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} historique`;
  }

  update(id: number, updateHistoriqueDto: UpdateHistoriqueDto) {
    return `This action updates a #${id} historique`;
  }

  remove(id: number) {
    return `This action removes a #${id} historique`;
  }
}
