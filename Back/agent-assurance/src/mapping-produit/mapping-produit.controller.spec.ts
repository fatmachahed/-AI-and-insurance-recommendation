import { Test, TestingModule } from '@nestjs/testing';
import { MappingProduitController } from './mapping-produit.controller';
import { MappingProduitService } from './mapping-produit.service';

describe('MappingProduitController', () => {
  let controller: MappingProduitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MappingProduitController],
      providers: [MappingProduitService],
    }).compile();

    controller = module.get<MappingProduitController>(MappingProduitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
