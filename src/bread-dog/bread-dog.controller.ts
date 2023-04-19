import { BreadDogService } from './bread-dog.service';
import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators';

@Controller('bread-dog')
export class BreadDogController {
  constructor(private readonly breadDogService: BreadDogService) {}

  @Get()
  async getAllBredDogs() {
    return this.breadDogService.getAll();
  }
}
