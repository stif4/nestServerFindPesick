import { Test, TestingModule } from '@nestjs/testing';
import { ColorDogController } from './color-dog.controller';

describe('ColorDogController', () => {
  let controller: ColorDogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColorDogController],
    }).compile();

    controller = module.get<ColorDogController>(ColorDogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
