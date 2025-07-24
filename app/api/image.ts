import { fileStorageS3 } from '~/file-storage.server';
import type { Route } from './+types/image';

export async function loader({ params }: Route.LoaderArgs) {
  const file = await fileStorageS3.get(params.storageKey);

  if (!file) {
    throw new Response('File not found', {
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
