import { Test, TestingModule } from '@nestjs/testing';
import { BreadDogService } from './bread-dog.service';

describe('BreadDogService', () => {
  let service: BreadDogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BreadDogService],
    }).compile();

    service = module.get<BreadDogService>(BreadDogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
