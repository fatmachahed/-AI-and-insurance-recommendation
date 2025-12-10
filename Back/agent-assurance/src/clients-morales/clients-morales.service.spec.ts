import { Test, TestingModule } from '@nestjs/testing';
import { ClientsMoralesService } from './clients-morales.service';

describe('ClientsMoralesService', () => {
  let service: ClientsMoralesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientsMoralesService],
    }).compile();

    service = module.get<ClientsMoralesService>(ClientsMoralesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
