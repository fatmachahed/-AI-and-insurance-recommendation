import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunite } from './entities/opportunite.entity';
import { CreateOpportuniteDto } from './dto/create-opportunite.dto';
import { UpdateOpportuniteDto } from './dto/update-opportunite.dto';

@Injectable()
export class OpportunitesService {
  constructor(
    @InjectRepository(Opportunite)
    private readonly opportuniteRepository: Repository<Opportunite>,
  ) {}

  create(createOpportuniteDto: CreateOpportuniteDto) {
    const op = this.opportuniteRepository.create(createOpportuniteDto);
    return this.opportuniteRepository.save(op);
  }

  findAll() {
    return this.opportuniteRepository.find();
  }

  findOne(id: number) {
    return this.opportuniteRepository.findOne({ where: { ID_OPPORTUNITE: id } });
  }

  update(id: number, updateOpportuniteDto: UpdateOpportuniteDto) {
    return this.opportuniteRepository.update(id, updateOpportuniteDto);
  }

  remove(id: number) {
    return this.opportuniteRepository.delete(id);
  }

  findByClient(ref: string) {
    return this.opportuniteRepository.find({ where: { REF_PERSONNE: ref } });
  }
}
