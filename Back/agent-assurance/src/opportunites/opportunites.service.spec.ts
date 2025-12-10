import { Test, TestingModule } from '@nestjs/testing';
import { OpportunitesService } from './opportunites.service';

describe('OpportunitesService', () => {
  let service: OpportunitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpportunitesService],
    }).compile();

    service = module.get<OpportunitesService>(OpportunitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
