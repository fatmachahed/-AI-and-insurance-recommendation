import { Test, TestingModule } from '@nestjs/testing';
import { SinistresController } from './sinistres.controller';
import { SinistresService } from './sinistres.service';

describe('SinistresController', () => {
  let controller: SinistresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SinistresController],
      providers: [SinistresService],
    }).compile();

    controller = module.get<SinistresController>(SinistresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
