import { IsArray, IsDateString, IsNumber, IsString } from 'class-validator';

export class PostDogDto {
  @IsString()
  userId: string;
  @IsArray()
  @IsNumber({}, { each: true })
  coords: number[];
  @IsString()
  streetName: string;
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
  vk: string;
  @IsString()
  comment: string;
}
