// src/clients/clients.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { ClientMorale } from '../clients-morales/entities/clients-morale.entity';
import { ClientPhysique } from '../clients-physiques/entities/clients-physique.entity';
// Nouvelles entités
import { Contrat } from '../contrats/entities/contrat.entity';
import { Sinistre } from '../sinistres/entities/sinistre.entity';
import { MappingProduit } from '../mapping-produit/entities/mapping-produit.entity';
import { Opportunite } from '../opportunites/entities/opportunite.entity';
import { Historique } from '../historique/entities/historique.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
      ClientMorale,
      ClientPhysique,
      Contrat, 
      Sinistre, 
      MappingProduit, 
      Opportunite, 
      Historique
    ])],
  providers: [ClientsService],
  controllers: [ClientsController],
})
export class ClientsModule {}
