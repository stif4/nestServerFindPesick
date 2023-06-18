import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcryptjs';
import { Model } from 'mongoose';
import {
  PostsCat,
  PostsCatDocument,
} from '../posts-cat/posts-cat.model/posts-cat.model';
import {
  PostsDog,
  PostsDogDocument,
} from '../posts-dog/posts-dog.model/posts-dog.model';
import { UpdateDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.model/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(PostsCat.name)
    private readonly catModel: Model<PostsCatDocument>,
    @InjectModel(PostsDog.name)
    private readonly dogModel: Model<PostsDogDocument>,
  ) {}

  async byId(_id: string) {
    const user = await this.userModel.findById(_id);
    if (!user) throw new NotFoundException('User not found');
    const postsCat = await this.catModel.find({ userId: user._id });
    await this.catModel.populate(postsCat, { path: 'breed color' });
    const postsDog = await this.dogModel.find({ userId: user._id });
    await this.dogModel.populate(postsDog, { path: 'breed color' });
    return { user, advertisments: [...postsDog, ...postsCat] };
  }

  async updateProfile(id: string, data: UpdateDto, _id: string) {
    if (id === _id.toString()) {
      const user = await this.userModel.findById(_id);
      const isSameUser = await this.userModel.findOne({ email: data.email });

      if (isSameUser && String(_id) !== String(isSameUser._id)) {
        throw new NotFoundException('Email busy');
      }

      if (user) {
        if (data.password) {
          const salt = await genSalt(10);
          user.password = await hash(data.password, salt);
        }

        user.email = data.email;
        user.phone = data.phone;
        user.comment = data.comment;
        user.usernameTg = data.usernameTg;
        user.block = data.block;

        // if (data.isAdmin || data.isAdmin === false) user.isAdmin = data.isAdmin;

        await user.save();
        return user;
      }
    } else {
      throw new ForbiddenException('Forbidden');
    }
    throw new NotFoundException('User not found');
  }

  async getCount() {
    return this.userModel.find().count().exec();
  }

  async getAll(searchTerm?: string): Promise<User[]> {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            login: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.userModel
      .find(options)
      .select('-password -updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async delete(id: string): Promise<User[]> {
    return this.userModel.findByIdAndDelete(id);
  }
}
