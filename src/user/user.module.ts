import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsCatModel } from '../posts-cat/posts-cat.model/posts-cat.model';
import { PostsDogModel } from '../posts-dog/posts-dog.model/posts-dog.model';
import { UserController } from './user.controller';
import { UserModel } from './user.model/user.model';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserModel },
      { name: 'PostsDog', schema: PostsDogModel },
      { name: 'PostsCat', schema: PostsCatModel },
    ]),
  ],
})
export class UserModule {}
