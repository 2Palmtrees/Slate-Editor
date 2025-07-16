import { LocalFileStorage } from '@mjackson/file-storage/local';
import { S3Client } from '@aws-sdk/client-s3';
import { S3FileStorage } from './api/s3-file-storage';

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

export const fileStorage = new LocalFileStorage('./uploads/images');

export const fileStorageS3 = new S3FileStorage(s3Client, 'bart-joostink-test1');

export function getStorageKey(imageId: string) {
  return `image-${imageId}`;
}
