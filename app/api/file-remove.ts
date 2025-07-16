import { fileStorage, getStorageKey } from '~/image-storage.server';
import type { Route } from './+types/file-remove';

export async function action({ params }: Route.ActionArgs) {
  let imageId = params.id;

  console.log('delete:', imageId);
  

  let storageKey = getStorageKey(imageId);
  await fileStorage.remove(storageKey);
  console.log('image removed!?');
}
