import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriqueService } from './historique.service';
import { HistoriqueController } from './historique.controller';
import { Historique } from '../historique/entities/historique.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Historique])],
  controllers: [HistoriqueController],
  providers: [HistoriqueService],
})
export class HistoriqueModule {}
