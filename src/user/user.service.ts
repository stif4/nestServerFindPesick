import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { UpdateDto } from './dto/update-user.dto';
import { User, UserDocument, UserModel } from './user.model/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async byId(_id: string) {
    const user = await this.userModel.findById(_id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(_id: string, data: UpdateDto) {
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
      if (data.isAdmin || data.isAdmin === false) user.isAdmin = data.isAdmin;

      await user.save();
      return;
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
            email: new RegExp(searchTerm, 'i'),
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
