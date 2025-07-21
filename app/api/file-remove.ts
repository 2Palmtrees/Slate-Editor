import { fileStorageS3 } from '~/image-storage.server';
import type { Route } from './+types/file-remove';
import { resizeImages } from './sharpen';

export async function action({ params }: Route.ActionArgs) {
  let imageLocation = params.imageLocation;

  console.log(imageLocation);
  
  let storageKey:string;
  for await (const element of resizeImages) {
    storageKey = `${imageLocation}-${element.name}`;

    await fileStorageS3.remove(storageKey);

    console.log('deletes:', storageKey);
  }

}
