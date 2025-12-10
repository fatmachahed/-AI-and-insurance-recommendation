import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContratDto } from './dto/create-contrat.dto';
import { UpdateContratDto } from './dto/update-contrat.dto';
import { Contrat } from './entities/contrat.entity';

@Injectable()
export class ContratsService {
  constructor(
    @InjectRepository(Contrat)
    private contratsRepo: Repository<Contrat>,
  ) {}

  async create(createContratDto: CreateContratDto): Promise<Contrat> {
    const newContrat = this.contratsRepo.create(createContratDto);
    return await this.contratsRepo.save(newContrat);
  }

  async findAll(): Promise<Contrat[]> {
    return await this.contratsRepo.find();
  }

  async findByRefPersonne(refPersonne: string): Promise<Contrat[]> {
    return await this.contratsRepo.find({
      where: { REF_PERSONNE: refPersonne },
    });
  }

  async findOne(id: number): Promise<Contrat | null> {
    return await this.contratsRepo.findOne({
      where: { id },
    });
  }

  async update(id: number, updateContratDto: UpdateContratDto): Promise<Contrat | null> {
    const result = await this.contratsRepo.update(id, updateContratDto);
    
    if (result.affected === 0) {
      return null; // Aucun enregistrement n'a été mis à jour
    }
    
    return await this.findOne(id);
  }

}