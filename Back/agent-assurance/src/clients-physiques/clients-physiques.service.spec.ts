import { Test, TestingModule } from '@nestjs/testing';
import { ClientsPhysiquesService } from './clients-physiques.service';

describe('ClientsPhysiquesService', () => {
  let service: ClientsPhysiquesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientsPhysiquesService],
    }).compile();

    service = module.get<ClientsPhysiquesService>(ClientsPhysiquesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
