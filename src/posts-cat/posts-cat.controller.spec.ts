import { Test, TestingModule } from '@nestjs/testing';
import { PostsCatController } from './posts-cat.controller';

describe('PostsCatController', () => {
  let controller: PostsCatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsCatController],
    }).compile();

    controller = module.get<PostsCatController>(PostsCatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
