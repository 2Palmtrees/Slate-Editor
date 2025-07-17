import { fileStorageS3 } from '~/image-storage.server';
import type { Route } from './+types/file-remove';

export async function action({ params }: Route.ActionArgs) {
  await fileStorageS3.remove(params.storageKey);
}
