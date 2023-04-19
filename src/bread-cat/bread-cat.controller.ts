import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators';
import { BreadCatService } from './bread-cat.service';

@Controller('bread-cat')
export class BreadCatController {
  constructor(private readonly breadDogService: BreadCatService) {}

  @Get()
  async getAllBredDogs() {
    return this.breadDogService.getAll();
  }
}
