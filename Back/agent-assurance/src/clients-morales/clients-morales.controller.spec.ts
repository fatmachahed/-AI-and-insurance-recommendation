import { Test, TestingModule } from '@nestjs/testing';
import { ClientsMoralesController } from './clients-morales.controller';
import { ClientsMoralesService } from './clients-morales.service';

describe('ClientsMoralesController', () => {
  let controller: ClientsMoralesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsMoralesController],
      providers: [ClientsMoralesService],
    }).compile();

    controller = module.get<ClientsMoralesController>(ClientsMoralesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
