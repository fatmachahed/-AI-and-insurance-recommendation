import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientsMoraleDto } from './dto/create-clients-morale.dto';
import { UpdateClientsMoraleDto } from './dto/update-clients-morale.dto';
import { ClientMorale } from '../clients-morales/entities/clients-morale.entity';

@Injectable()
export class ClientsMoralesService {
  constructor(
    @InjectRepository(ClientMorale)
    private clientsRepo: Repository<ClientMorale>,
  ) {}

  async create(createClientsMoraleDto: CreateClientsMoraleDto): Promise<ClientMorale> {
    const newClient = this.clientsRepo.create(createClientsMoraleDto);
    return await this.clientsRepo.save(newClient);
  }

  async findAll(): Promise<ClientMorale[]> {
    return await this.clientsRepo.find();
  }

  async findOne(ref_personne: string): Promise<ClientMorale> {
    const client = await this.clientsRepo.findOne({ where: { ref_personne } });
    if (!client) {
      throw new NotFoundException(`Client moral avec la référence ${ref_personne} non trouvé`);
    }
    return client;
  }

  async update(ref_personne: string, updateClientsMoraleDto: UpdateClientsMoraleDto): Promise<ClientMorale> {
    await this.clientsRepo.update(ref_personne, updateClientsMoraleDto);
    const updatedClient = await this.clientsRepo.findOne({ where: { ref_personne } });
    if (!updatedClient) {
      throw new NotFoundException(`Client moral avec la référence ${ref_personne} non trouvé`);
    }
    return updatedClient;
  }

  async remove(ref_personne: string): Promise<void> {
    const result = await this.clientsRepo.delete(ref_personne);
    if (result.affected === 0) {
      throw new NotFoundException(`Client moral avec la référence ${ref_personne} non trouvé`);
    }
  }
}