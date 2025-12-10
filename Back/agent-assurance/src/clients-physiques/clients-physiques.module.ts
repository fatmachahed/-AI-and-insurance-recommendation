import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsPhysiquesController } from './clients-physiques.controller';
import { ClientsPhysiquesService } from './clients-physiques.service';
import { ClientPhysique } from '../clients-physiques/entities/clients-physique.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientPhysique])],
  controllers: [ClientsPhysiquesController],
  providers: [ClientsPhysiquesService],
})
export class ClientsPhysiquesModule {}
