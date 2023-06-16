import { BreadCat } from './../bread-cat/bread-cat.model/bread-cat.model';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { BreadCatDocument } from 'src/bread-cat/bread-cat.model/bread-cat.model';
import {
  Telegram,
  TelegramDocument,
} from '../telegram/telegram.model/telegram.model';
import { TelegramService } from '../telegram/telegram.service';
import { PostCatDto } from './dto/posts-cat.dto';
import { PostsCat, PostsCatDocument } from './posts-cat.model/posts-cat.model';

@Injectable()
export class PostsCatService {
  constructor(
    @InjectModel(PostsCat.name)
    private readonly postsCatModel: Model<PostsCatDocument>,
    @InjectModel(Telegram.name)
    private readonly telegramModel: Model<TelegramDocument>,
    private readonly telegramService: TelegramService,
    @InjectModel(BreadCat.name)
    private readonly breedCatModel: Model<BreadCatDocument>,
  ) {}

  async getAll(dataQuery) {
    if (Object.keys(dataQuery).length !== 0) {
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
        const coords = dataQuery.coords.split(' ').map(Number);
        options.unshift({
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: coords,
            },
            distanceField: 'dist.calculated',
            maxDistance: 10000,
            includeLocs: 'dist.location',
            spherical: true,
          },
        });
      }

      const arg = await this.postsCatModel.aggregate(options);
      await this.postsCatModel.populate(arg, { path: 'breed color' });
      return arg;
    } else {
      return this.postsCatModel.find().populate('breed color').exec();
    }
  }

  async create(data: PostCatDto) {
    const checkBreed = await this.breedCatModel.findById(data.breed);

    if (checkBreed) {
      const options: PipelineStage[] = [
        {
          $match: {
            breed: new Types.ObjectId(data.breed),
            sex: data.sex,
            type: data.type === 0 ? 1 : 0,
          },
        },
      ];

      options.unshift({
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: data.coords as [number, number],
          },
          distanceField: 'dist.calculated',
          maxDistance: 10000,
          includeLocs: 'dist.location',
          spherical: true,
        },
      });

      const arg = await this.postsCatModel.aggregate(options);
      const post = await this.postsCatModel.create({
        ...data,
        dogOrCat: 'cat',
      });
      this.sendNotifications(arg, post);
      return post;
    } else {
      throw new NotFoundException('Breed is not found');
    }
  }

  async sendNotifications(similarAdvertisments, advertisment) {
    // if (process.env.NODE_ENV !== 'development')
    //   await this.telegramService.sendPhoto(dto.poster);

    await this.postsCatModel.populate(similarAdvertisments, {
      path: 'breed color',
    });
    await this.postsCatModel.populate(advertisment, { path: 'breed color' });

    const adminTg = await this.telegramModel.find({
      username: 'MarkizBarobas',
    });

    const msg =
      `Новое объявление: \n\n` +
      `${advertisment.type === 1 ? 'Найдена ' : 'Потеряна '}` +
      `${advertisment.dogOrCat === 'cat' ? 'кошка' : 'собака'} \n\n` +
      `Порода: <b>${advertisment.breed.label}</b>\n\n` +
      `Окрас: <b>${advertisment.color.label}</b>\n\n` +
      `Комментарий: ${advertisment.comment}\n\n` +
      `Связаться: tg ${advertisment.usernameTg}, ${
        advertisment.phone ? advertisment.phone : ''
      }`;

    await this.telegramService.sendMessage(
      msg,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                url: 'https://okko.tv/movie/free-guy',
                text: 'Просмотреть объявление',
              },
            ],
          ],
        },
      },
      adminTg[0].chatId,
    );

    const currentUserTg = await this.telegramModel.find({
      username: advertisment.usernameTg,
    });

    await Promise.all(
      similarAdvertisments.map(async (a) => {
        const tgUser = await this.telegramModel.find({
          username: a.usernameTg,
        });

        if (tgUser.length && tgUser[0].username === a.usernameTg) {
          const msg =
            `Возможно это ваш питомец: \n\n` +
            `${advertisment.type === 1 ? 'Найдена ' : 'Потеряна '}` +
            `${advertisment.dogOrCat === 'cat' ? 'кошка' : 'собака'} \n\n` +
            `Порода: <b>${advertisment.breed.label}</b>\n\n` +
            `Окрас: <b>${advertisment.color.label}</b>\n\n` +
            `Комментарий: ${advertisment.comment}\n\n` +
            `Связаться: tg ${advertisment.usernameTg}, ${
              advertisment.phone ? advertisment.phone : ''
            }`;

          await this.telegramService.sendMessage(
            msg,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      url: 'https://okko.tv/movie/free-guy',
                      text: 'Просмотреть объявление',
                    },
                  ],
                ],
              },
            },
            tgUser[0].chatId,
          );
        }

        if (
          currentUserTg.length &&
          currentUserTg[0].username === advertisment.usernameTg
        ) {
          const msg2 =
            `Возможно это ваш питомец: \n\n` +
            `${a.type === 1 ? 'Найдена ' : 'Потеряна '}` +
            `${a.dogOrCat === 'cat' ? 'кошка' : 'собака'} \n\n` +
            `Порода: <b>${a.breed.label}</b>\n\n` +
            `Окрас: <b>${a.color.label}</b>\n\n` +
            `Комментарий: ${a.comment}\n\n` +
            `Связаться: ${a.usernameTg}  ${a.phone}`;

          await this.telegramService.sendMessage(
            msg2,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      url: 'https://okko.tv/movie/free-guy',
                      text: 'Просмотреть объявление',
                    },
                  ],
                ],
              },
            },
            currentUserTg[0].chatId,
          );
        }
        return;
      }),
    );
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
