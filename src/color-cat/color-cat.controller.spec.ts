import { Test, TestingModule } from '@nestjs/testing';
import { ColorCatController } from './color-cat.controller';

describe('ColorCatController', () => {
  let controller: ColorCatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColorCatController],
    }).compile();

    controller = module.get<ColorCatController>(ColorCatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
