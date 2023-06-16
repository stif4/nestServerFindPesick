import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ColorCatService } from './color-cat.service';

describe('ColorCatService', () => {
  let service: ColorCatService;

  const exec = { exec: jest.fn() };
  const reviewRepositoryFactory = () => ({
    find: () => exec,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColorCatService,
        {
          useFactory: reviewRepositoryFactory,
          provide: getModelToken('ColorCat'),
        },
      ],
    }).compile();

    service = module.get<ColorCatService>(ColorCatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get all collors', async () => {
    reviewRepositoryFactory()
      .find()
      .exec.mockReturnValueOnce([{ id: 'qweqweqwe', value: 'blue' }]);
    const res = await service.getAll();
    expect(res).toStrictEqual([{ id: 'qweqweqwe', value: 'blue' }]);
  });
});
