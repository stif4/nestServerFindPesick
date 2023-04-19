import { Test, TestingModule } from '@nestjs/testing';
import { BreadCatController } from './bread-cat.controller';

describe('BreadCatController', () => {
  let controller: BreadCatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BreadCatController],
    }).compile();

    controller = module.get<BreadCatController>(BreadCatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
