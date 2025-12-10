import { Test, TestingModule } from '@nestjs/testing';
import { ContratsController } from './contrats.controller';
import { ContratsService } from './contrats.service';

describe('ContratsController', () => {
  let controller: ContratsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContratsController],
      providers: [ContratsService],
    }).compile();

    controller = module.get<ContratsController>(ContratsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
