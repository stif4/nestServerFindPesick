import { Test, TestingModule } from '@nestjs/testing';
import { PostsCatService } from './posts-cat.service';

describe('PostsCatService', () => {
  let service: PostsCatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsCatService],
    }).compile();

    service = module.get<PostsCatService>(PostsCatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
