import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(private readonly configService: ConfigService) {}

  async upload(fileName: string, file: Buffer, userId: string) {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
          Key: `${userId}/${fileName}`,
          Body: file,
        }),
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
