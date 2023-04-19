import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  Query
} from '@nestjs/common/decorators';
import { Controller } from '@nestjs/common';
import { PostsDogService } from './posts-dog.service';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { ValidationPipe } from '@nestjs/common/pipes';
import { IdValidationPipe } from 'src/pipes/id.validations.pipe';
import { User } from 'src/user/user.decorators/user.decorators';
import { NotFoundException } from '@nestjs/common/exceptions';
import { PostDogDto } from './dto/posts-dog.dto';

@Controller('posts-dog')
export class PostsDogController {
  constructor(private readonly postsDogService: PostsDogService) {}

  @Get()
  async getAllCatPosts(@Query() queryData?) {
    return this.postsDogService.getAll(queryData);
  }

  @Auth()
  @Post()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async createCatPost(@Body() data: PostDogDto) {
    return this.postsDogService.create(data);
  }

  @Get(':id')
  @HttpCode(200)
  async getCatPost(@Param('id', IdValidationPipe) id: string) {
    return this.postsDogService.getPost(id);
  }

  @Auth()
  @Put(':id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: PostDogDto,
    @User('_id') userId: string,
    @User('isAdmin') isAdmin: boolean,
  ) {
    const updatePost = await this.postsDogService.updatePost(
      id,
      dto,
      userId,
      isAdmin,
    );
    if (!updatePost) throw new NotFoundException('Post not found');
    return updatePost;
  }

  @Auth()
  @Delete(':id')
  async delete(
    @Param('id', IdValidationPipe) id: string,
    @User('_id') userId: string,
    @User('isAdmin') isAdmin: boolean,
  ) {
    const deletedDoc = await this.postsDogService.delete(id, userId, isAdmin);
    if (!deletedDoc) throw new NotFoundException('Post not found');
  }
}
