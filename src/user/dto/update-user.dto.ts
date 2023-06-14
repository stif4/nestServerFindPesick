import { IsEmail, IsString } from 'class-validator';

export class UpdateDto {
  @IsEmail()
  email: string;

  // @IsString()
  password?: string;

  isAdmin?: boolean;

  phone?: string;
  comment?: string;
  usernameTg?: string;
  block?: boolean;
}
