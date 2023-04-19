import { Test, TestingModule } from '@nestjs/testing';
import { ColorDogService } from './color-dog.service';

describe('ColorDogService', () => {
  let service: ColorDogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColorDogService],
    }).compile();

    service = module.get<ColorDogService>(ColorDogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
