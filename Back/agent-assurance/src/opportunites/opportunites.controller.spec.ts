import { Test, TestingModule } from '@nestjs/testing';
import { OpportunitesController } from './opportunites.controller';
import { OpportunitesService } from './opportunites.service';

describe('OpportunitesController', () => {
  let controller: OpportunitesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpportunitesController],
      providers: [OpportunitesService],
    }).compile();

    controller = module.get<OpportunitesController>(OpportunitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
