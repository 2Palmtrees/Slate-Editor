import { LocalFileStorage } from '@mjackson/file-storage/local';

export const fileStorage = new LocalFileStorage('./uploads/images');

export function getStorageKey(imageId: string) {
  return `image-${imageId}`;
}
