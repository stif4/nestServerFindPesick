import { Test, TestingModule } from '@nestjs/testing';
import { BreadDogController } from './bread-dog.controller';

describe('BreadDogController', () => {
  let controller: BreadDogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BreadDogController],
    }).compile();

    controller = module.get<BreadDogController>(BreadDogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
