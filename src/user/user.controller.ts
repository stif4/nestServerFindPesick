import { IdValidationPipe } from './../pipes/id.validations.pipe';
import { UserService } from 'src/user/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { User } from './user.decorators/user.decorators';
import { UpdateDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@User('_id') _id: string) {
    return this.userService.byId(_id);
  }

  @UsePipes(new ValidationPipe())
  @Put('profile')
  @HttpCode(200)
  @Auth()
  async updateProfile(@User('_id') _id: string, @Body() data: UpdateDto) {
    return this.userService.updateProfile(_id, data);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth()
  async updateUser(
    @Param('id', IdValidationPipe) id: string,
    @Body() data: UpdateDto,
  ) {
    return this.userService.updateProfile(id, data);
  }

  @Get('count')
  @Auth('admin')
  async getCountUsers() {
    return this.userService.getCount();
  }

  @Get()
  @Auth('admin')
  async getUsers(@Query('searchTerm') searchTerm?: string) {
    return this.userService.getAll(searchTerm);
  }

  @Get(':id')
  @Auth()
  async getUser(@Param('id', IdValidationPipe) id: string) {
    return this.userService.byId(id);
  }

  @Delete(':id')
  @Auth('admin')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.userService.delete(id);
    if (!deletedDoc) throw new NotFoundException('User not found');
  }
}
