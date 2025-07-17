import { fileStorageS3 } from '~/image-storage.server';
import sharp from 'sharp';

export type ImageSizes = 'xlarge' | 'large' | 'medium' | 'small';

export const resizeImages: {
  name: ImageSizes;
  size: number;
}[] = [
  { name: 'xlarge', size: 1900 },
  { name: 'large', size: 1000 },
  { name: 'medium', size: 750 },
  { name: 'small', size: 500 },
];

export async function sharpenImage(imageId: string, file: File) {
  for await (const element of resizeImages) {
    let s3StorageKey = `${imageId}-${element.name}`;
    let data = await sharp(await file.arrayBuffer())
      .rotate()
      .resize(element.size, element.size, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toBuffer();
    let newFile = new File([data], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    });
    fileStorageS3.set(s3StorageKey, newFile);
  }
}
