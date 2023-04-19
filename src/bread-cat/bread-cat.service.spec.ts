import { Test, TestingModule } from '@nestjs/testing';
import { BreadCatService } from './bread-cat.service';

describe('BreadCatService', () => {
  let service: BreadCatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BreadCatService],
    }).compile();

    service = module.get<BreadCatService>(BreadCatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
