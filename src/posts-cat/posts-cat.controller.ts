import { Auth } from 'src/auth/decorator/auth.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { IdValidationPipe } from 'src/pipes/id.validations.pipe';
import { PostCatDto } from './dto/posts-cat.dto';
import { PostsCatService } from './posts-cat.service';
import { User } from 'src/user/user.decorators/user.decorators';

@Controller('posts-cat')
export class PostsCatController {
  constructor(private readonly postsCatService: PostsCatService) {}

  @Get()
  async getAllCatPosts(@Query() queryData?) {
    return this.postsCatService.getAll(queryData);
  }

  @Auth()
  @Post()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async createCatPost(@Body() data: PostCatDto) {
    return this.postsCatService.create(data);
  }

  @Get(':id')
  @HttpCode(200)
  async getCatPost(@Param('id', IdValidationPipe) id: string) {
    return this.postsCatService.getPost(id);
  }

  @Auth()
  @Put(':id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: PostCatDto,
    @User('_id') userId: string,
    @User('isAdmin') isAdmin: boolean,
  ) {
    const updatePost = await this.postsCatService.updatePost(
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
    const deletedDoc = await this.postsCatService.delete(id, userId, isAdmin);
    if (!deletedDoc) throw new NotFoundException('Post not found');
  }
}
