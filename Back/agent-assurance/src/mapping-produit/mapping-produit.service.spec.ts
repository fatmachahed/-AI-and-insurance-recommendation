import { Test, TestingModule } from '@nestjs/testing';
import { MappingProduitService } from './mapping-produit.service';

describe('MappingProduitService', () => {
  let service: MappingProduitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MappingProduitService],
    }).compile();

    service = module.get<MappingProduitService>(MappingProduitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
