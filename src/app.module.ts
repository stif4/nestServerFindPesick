import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './configs/mongo.config';
import { UserModule } from './user/user.module';
import { BreadCatModule } from './bread-cat/bread-cat.module';
import { BreadDogModule } from './bread-dog/bread-dog.module';
import { ColorCatModule } from './color-cat/color-cat.module';
import { ColorDogModule } from './color-dog/color-dog.module';
import { PostsCatModule } from './posts-cat/posts-cat.module';
import { PostsDogModule } from './posts-dog/posts-dog.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    BreadCatModule,
    BreadDogModule,
    ColorCatModule,
    ColorDogModule,
    PostsCatModule,
    PostsDogModule,
  ],
})
export class AppModule {}
