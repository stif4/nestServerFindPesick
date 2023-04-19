import { Test, TestingModule } from '@nestjs/testing';
import { PostsDogService } from './posts-dog.service';

describe('PostsDogService', () => {
  let service: PostsDogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsDogService],
    }).compile();

    service = module.get<PostsDogService>(PostsDogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
