import { Injectable } from '@nestjs/common';
import { ensureDir, writeFile } from 'fs-extra';
import { FileResponse } from './file.interfaces';
import { path } from 'app-root-path';
import { randomUUID } from 'crypto';

@Injectable()
export class FileService {
  async saveFiles(
    files: Express.Multer.File[],
    folder: string = 'default',
  ): Promise<FileResponse[]> {
    const uploadFolder = `${path}/uploads/${folder}`;
    await ensureDir(uploadFolder);
    const hash = randomUUID();
    const res: FileResponse[] = await Promise.all(
      files.map(async (file) => {
        await writeFile(
          `${uploadFolder}/${hash + file.originalname}`,
          file.buffer,
        );
        return {
          url: `/uploads/${folder}/${hash + file.originalname}`,
          name: file.originalname,
        };
      }),
    );
    return res;
  }
}
