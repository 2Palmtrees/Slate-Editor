import { fileStorage, getStorageKey } from '~/image-storage.server';
import type { Route } from './+types/file';

export async function loader({ params }: Route.LoaderArgs) {
  const storageKey = getStorageKey(params.id);
  const file = await fileStorage.get(storageKey);

  console.log('storageKey', storageKey);

  if (!file) {
    throw new Response('User avatar not found', {
      status: 404,
    });
  }

  return new Response(file.stream(), {
    headers: {
      'Content-Type': file.type,
      'Content-Disposition': `attachment; filename=${file.name}`,
    },
  });
}
