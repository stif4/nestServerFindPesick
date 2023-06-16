import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ColorDogService } from './color-dog.service';

describe('ColorDogService', () => {
  let service: ColorDogService;

  const exec = { exec: jest.fn() };
  const reviewRepositoryFactory = () => ({
    find: () => exec,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColorDogService,
        {
          useFactory: reviewRepositoryFactory,
          provide: getModelToken('ColorDog'),
        },
      ],
    }).compile();

    service = module.get<ColorDogService>(ColorDogService);
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
