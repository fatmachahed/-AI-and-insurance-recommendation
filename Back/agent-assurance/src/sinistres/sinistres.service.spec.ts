import { Test, TestingModule } from '@nestjs/testing';
import { SinistresService } from './sinistres.service';

describe('SinistresService', () => {
  let service: SinistresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SinistresService],
    }).compile();

    service = module.get<SinistresService>(SinistresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
