import { IsString, Matches, MinLength } from 'class-validator';

// создать модель регистрации и логинизации отдельно 
export class AuthDto {
  @IsString()
  email: string;

  login?: string;

  @MinLength(6, { message: 'Password cannot be less than 6 characters' })
  @IsString()
  password: string;
  
  confirm?: string;
}
