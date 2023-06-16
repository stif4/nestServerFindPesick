import { FileResponse } from './file.interfaces';
import {
  Controller,
  HttpCode,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from './../auth/decorator/auth.decorator';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private readonly filesService: FileService) {}
  @Post()
  @HttpCode(200)
  @Auth()
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ): Promise<FileResponse[]> {
    return this.filesService.saveFiles([file], folder);
  }
}
