import { Get } from '@nestjs/common/decorators';
import { Controller } from '@nestjs/common';
import { ColorCatService } from './color-cat.service';

@Controller('color-cat')
export class ColorCatController {
  constructor(private readonly colorCatService: ColorCatService) {}

  @Get()
  async getAllColorCats() {
    return this.colorCatService.getAll();
  }
}
