import { Test, TestingModule } from '@nestjs/testing';
import { ClientsPhysiquesController } from './clients-physiques.controller';
import { ClientsPhysiquesService } from './clients-physiques.service';

describe('ClientsPhysiquesController', () => {
  let controller: ClientsPhysiquesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsPhysiquesController],
      providers: [ClientsPhysiquesService],
    }).compile();

    controller = module.get<ClientsPhysiquesController>(ClientsPhysiquesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
