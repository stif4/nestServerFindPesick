import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { PostCatDto } from './dto/posts-cat.dto';
import { PostsCat, PostsCatDocument } from './posts-cat.model/posts-cat.model';

@Injectable()
export class PostsCatService {
  constructor(
    @InjectModel(PostsCat.name)
    private readonly postsCatModel: Model<PostsCatDocument>,
  ) {}

  async getAll(dataQuery) {
    for (let key in dataQuery) {
      if (key !== 'coords') {
        dataQuery[key] =
          dataQuery[key] === 'none' ? { $exists: true } : dataQuery[key];
      }
    }

    const options: PipelineStage[] = [
      {
        $match: {
          breed:
            dataQuery.breed.$exists !== undefined
              ? dataQuery.breed
              : new Types.ObjectId(dataQuery.breed),
          sex:
            dataQuery.sex.$exists !== undefined
              ? dataQuery.sex
              : Number(dataQuery.sex),
          type:
            dataQuery.type.$exists !== undefined
              ? dataQuery.type
              : Number(dataQuery.type),
          color:
            dataQuery.color.$exists !== undefined
              ? dataQuery.color
              : new Types.ObjectId(dataQuery.color),
          date:
            dataQuery.date.$exists !== undefined
              ? dataQuery.date
              : { $gte: new Date(dataQuery.date) },
        },
      },
    ];

    if (dataQuery.coords !== 'none') {
      options.unshift({
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: dataQuery.coords.split(' ').map(Number),
          },
          distanceField: 'dist.calculated',
          maxDistance: 2,
          includeLocs: 'dist.location',
          spherical: true,
        },
      });
    }

    const arg = await this.postsCatModel.aggregate(options);
    await this.postsCatModel.populate(arg, { path: 'breed color' });
    return arg;
  }

  async create(data: PostCatDto) {
    const post = await this.postsCatModel.create({ ...data, dogOrCat: 'cat' });
    return post;
  }

  async getPost(_id: string) {
    const post = await this.postsCatModel.findById(_id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async delete(id: string, userId: string, isAdmin: boolean) {
    const post = await this.postsCatModel.findById(id);
    if (userId.toString() === post.userId || isAdmin) {
      return this.postsCatModel.findByIdAndDelete(id);
    }
    throw new HttpException('Нет прав доступа', HttpStatus.FORBIDDEN);
  }

  async updatePost(
    _id: string,
    data: PostCatDto,
    userId: string,
    isAdmin: boolean,
  ) {
    if (userId.toString() === data.userId || isAdmin) {
      return await this.postsCatModel
        .findByIdAndUpdate(_id, data, { new: true })
        .exec();
    }
    throw new HttpException('Нет прав доступа', HttpStatus.FORBIDDEN);
  }
}
