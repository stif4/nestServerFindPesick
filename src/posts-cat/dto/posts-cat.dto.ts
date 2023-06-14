import { IsArray, IsDateString, IsNumber, IsString } from 'class-validator';
export class PostCatDto {
  @IsString()
  userId: string;
  @IsString()
  streetName: string;
  @IsArray()
  @IsNumber({}, { each: true })
  coords: number[];
  @IsNumber()
  type: number;
  @IsString()
  breed: string;
  @IsNumber()
  sex: number;
  @IsString()
  color: string;
  @IsDateString()
  date: Date;
  @IsString()
  phone: string;
  @IsString()
  usernameTg: string;
  @IsString()
  comment: string;
  @IsString()
  photo: string;
}
