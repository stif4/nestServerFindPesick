import { Test, TestingModule } from '@nestjs/testing';
import { ColorCatService } from './color-cat.service';

describe('ColorCatService', () => {
  let service: ColorCatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColorCatService],
    }).compile();

    service = module.get<ColorCatService>(ColorCatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
