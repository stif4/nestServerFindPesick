import { Get } from '@nestjs/common/decorators';
import { Controller } from '@nestjs/common';
import { ColorDogService } from './color-dog.service';

@Controller('color-dog')
export class ColorDogController {
  constructor(private readonly colorDogService: ColorDogService) {}

  @Get()
  async getAllColorDog() {
    return this.colorDogService.getAll();
  }
}
