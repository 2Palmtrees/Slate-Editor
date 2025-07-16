import { fileStorage, getStorageKey } from '~/image-storage.server';
import type { Route } from './+types/file-remove';

export async function action({ params }: Route.ActionArgs) {
  let storageKey = getStorageKey(params.id);
  await fileStorage.remove(storageKey);
}
