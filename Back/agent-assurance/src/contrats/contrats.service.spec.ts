import { Test, TestingModule } from '@nestjs/testing';
import { ContratsService } from './contrats.service';

describe('ContratsService', () => {
  let service: ContratsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContratsService],
    }).compile();

    service = module.get<ContratsService>(ContratsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
