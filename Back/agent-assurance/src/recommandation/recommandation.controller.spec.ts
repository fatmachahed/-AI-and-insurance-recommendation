import { Test, TestingModule } from '@nestjs/testing';
import { RecommandationController } from './recommandation.controller';
import { RecommandationService } from './recommandation.service';

describe('RecommandationController', () => {
  let controller: RecommandationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommandationController],
      providers: [RecommandationService],
    }).compile();

    controller = module.get<RecommandationController>(RecommandationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
