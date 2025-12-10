import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsMoralesService } from './clients-morales.service';
import { ClientsMoralesController } from './clients-morales.controller';
import { ClientMorale } from '../clients-morales/entities/clients-morale.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ClientMorale])],
  controllers: [ClientsMoralesController],
  providers: [ClientsMoralesService],
})
export class ClientsMoralesModule {}
