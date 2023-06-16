import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.model/user.model';
import { AuthDto } from './dto/auth.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: AuthDto) {
    const user = await this.validateUser(email, password);
    const tokens = await this.issueTokenPair(String(user._id));
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async register({ login, email, password, confirm }: AuthDto) {
    // это необходимо будет переписать как дикаратор (дикаратор на проверку совпадания паролей)
    if (password !== confirm)
      throw new UnauthorizedException('Пароли не совпадают!');
    const salt = await genSalt(10);
    const newUser = new this.UserModel({
      login,
      email,
      password: await hash(password, salt),
    });
    const user = await newUser.save();
    const tokens = await this.issueTokenPair(String(user._id));
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) throw new UnauthorizedException('Please sign in!');
    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid token or expired!');
    const user = await this.UserModel.findById(result._id);
    const tokens = await this.issueTokenPair(String(user._id));
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async findByEmail(email: string) {
    return this.UserModel.findOne({ email }).exec();
  }

  async findByLogin(login: string) {
    return this.UserModel.findOne({ login }).exec();
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (user && user.block) {
      throw new UnauthorizedException('User is blocked!');
    }
    if (!user) throw new UnauthorizedException('User not found');
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) throw new UnauthorizedException('Invalid password');
    return user;
  }

  async issueTokenPair(userId: string) {
    const data = { _id: userId };

    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d',
    });

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
    });

    return { refreshToken, accessToken };
  }

  returnUserFields(user) {
    return {
      _id: user._id,
      login: user.login,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }
}
