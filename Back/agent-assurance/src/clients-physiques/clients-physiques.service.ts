import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientPhysique } from '../clients-physiques/entities/clients-physique.entity';

@Injectable()
export class ClientsPhysiquesService {
  constructor(
    @InjectRepository(ClientPhysique)
    private clientsRepo: Repository<ClientPhysique>,
  ) {}

  findAll(): Promise<ClientPhysique[]> {
    return this.clientsRepo.find();
  }

  async findOne(ref_personne: string): Promise<ClientPhysique> {
    const client = await this.clientsRepo.findOne({ where: { ref_personne } });
    
    if (!client) {
      throw new NotFoundException(`Client physique avec la référence ${ref_personne} non trouvé`);
    }
    
    return client;
  }

  create(client: Partial<ClientPhysique>): Promise<ClientPhysique> {
    const newClient = this.clientsRepo.create(client);
    return this.clientsRepo.save(newClient);
  }
}