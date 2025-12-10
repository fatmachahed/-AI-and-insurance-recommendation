import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratsService } from './contrats.service';
import { ContratsController } from './contrats.controller';
import { Contrat } from '../contrats/entities/contrat.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Contrat])],
  controllers: [ContratsController],
  providers: [ContratsService],
})
export class ContratsModule {}
