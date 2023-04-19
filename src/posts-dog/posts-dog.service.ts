import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { PostDogDto } from './dto/posts-dog.dto';
import { PostsDog, PostsDogDocument } from './posts-dog.model/posts-dog.model';

@Injectable()
export class PostsDogService {
  constructor(
    @InjectModel(PostsDog.name)
    private readonly postsDogModel: Model<PostsDogDocument>,
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
          }, //[-73.99279, 40.719296],
          distanceField: 'dist.calculated',
          maxDistance: 2,
          includeLocs: 'dist.location',
          spherical: true,
        },
      });
    }

    //console.log(new Date(dataQuery.date).toISOString().split('T')[0]);

    const arg = await this.postsDogModel.aggregate(options);
    await this.postsDogModel.populate(arg, { path: 'breed color' });
    return arg;
    //return this.postsDogModel.find().populate('breed color').exec();
  }

  async create(data: PostDogDto) {
    const post = await this.postsDogModel.create({ ...data, dogOrCat: 'dog' });
    return post;
  }

  async getPost(_id: string) {
    const post = await this.postsDogModel.findById(_id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async delete(id: string, userId: string, isAdmin: boolean) {
    const post = await this.postsDogModel.findById(id);
    if (userId.toString() === post.userId || isAdmin) {
      return this.postsDogModel.findByIdAndDelete(id);
    }
    throw new HttpException('Нет прав доступа', HttpStatus.FORBIDDEN);
  }

  async updatePost(
    _id: string,
    data: PostDogDto,
    userId: string,
    isAdmin: boolean,
  ) {
    if (userId.toString() === data.userId || isAdmin) {
      return await this.postsDogModel
        .findByIdAndUpdate(_id, data, { new: true })
        .exec();
    }
    throw new HttpException('Нет прав доступа', HttpStatus.FORBIDDEN);
  }
}
