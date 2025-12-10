import { Test, TestingModule } from '@nestjs/testing';
import { RecommandationService } from './recommandation.service';

describe('RecommandationService', () => {
  let service: RecommandationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecommandationService],
    }).compile();

    service = module.get<RecommandationService>(RecommandationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
