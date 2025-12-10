import { Module } from '@nestjs/common';
import { MappingProduitService } from './mapping-produit.service';
import { MappingProduitController } from './mapping-produit.controller';

@Module({
  controllers: [MappingProduitController],
  providers: [MappingProduitService],
})
export class MappingProduitModule {}
