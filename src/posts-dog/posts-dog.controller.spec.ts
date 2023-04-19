import { Test, TestingModule } from '@nestjs/testing';
import { PostsDogController } from './posts-dog.controller';

describe('PostsDogController', () => {
  let controller: PostsDogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsDogController],
    }).compile();

    controller = module.get<PostsDogController>(PostsDogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
