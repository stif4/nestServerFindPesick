import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import {
  Telegram,
  TelegramDocument,
} from '../telegram/telegram.model/telegram.model';
import { TelegramService } from '../telegram/telegram.service';
import { PostDogDto } from './dto/posts-dog.dto';
import { PostsDog, PostsDogDocument } from './posts-dog.model/posts-dog.model';

@Injectable()
export class PostsDogService {
  constructor(
    @InjectModel(PostsDog.name)
    private readonly postsDogModel: Model<PostsDogDocument>,
    @InjectModel(Telegram.name)
    private readonly telegramModel: Model<TelegramDocument>,
    private readonly telegramService: TelegramService,
  ) {}

  async getAll(dataQuery) {
    console.log(dataQuery);
    if (Object.keys(dataQuery).length !== 0) {
      for (const key in dataQuery) {
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
            maxDistance: 10000,
            includeLocs: 'dist.location',
            spherical: true,
          },
        });
      }

      //console.log(new Date(dataQuery.date).toISOString().split('T')[0]);

      const arg = await this.postsDogModel.aggregate(options);

      await this.postsDogModel.populate(arg, { path: 'breed color' });
      return arg;
    } else {
      return this.postsDogModel.find().populate('breed color').exec();
    }
  }

  async create(data: PostDogDto) {
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
    const arg = await this.postsDogModel.aggregate(options);
    const post = await this.postsDogModel.create({ ...data, dogOrCat: 'dog' });
    this.sendNotifications(arg, post);
    return post;
  }

  async sendNotifications(similarAdvertisments, advertisment) {
    // if (process.env.NODE_ENV !== 'development')
    //   await this.telegramService.sendPhoto(dto.poster);

    await this.postsDogModel.populate(similarAdvertisments, {
      path: 'breed color',
    });
    await this.postsDogModel.populate(advertisment, { path: 'breed color' });

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
    console.log(_id);
    if (userId.toString() === data.userId || isAdmin) {
      return await this.postsDogModel
        .findByIdAndUpdate(_id, data, { new: true })
        .exec();
    }
    throw new HttpException('Нет прав доступа', HttpStatus.FORBIDDEN);
  }
}
