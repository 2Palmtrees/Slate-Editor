import {
  MaxFilesExceededError,
  MaxFileSizeExceededError,
  parseFormData,
  type FileUpload,
} from '@mjackson/form-data-parser';
import * as crypto from 'node:crypto';
import { data, redirect, type ActionFunctionArgs } from 'react-router';
// import { getSession } from '~/sessions.server';
import { sharpenImage } from './sharpen';

export async function action({ request }: ActionFunctionArgs) {
  let imageId = crypto.randomBytes(8).toString('hex');
  let imageLocation = 'content-item-' + imageId
  const uploadHandler = async (fileUpload: FileUpload) => {
    if (
      fileUpload.fieldName === 'image' &&
      fileUpload.type.startsWith('image/')
    ) {
      return await sharpenImage(imageLocation, fileUpload);
    }
  };
  const errors = {};
  try {
    await parseFormData(
      request,
      { maxFiles: 5, maxFileSize: 5 * 1024 * 1024 }, // 5 Mb
      uploadHandler
    );
  } catch (error) {
    if (error instanceof MaxFilesExceededError) {
      errors.image = 'Request may not contain more than 5 files';
    } else if (error instanceof MaxFileSizeExceededError) {
      errors.image = 'Files may not be larger than 5 MiB';
    } else {
      errors.image = 'An unknown error occurred!';
    }
  }

  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  } else {
    return { imageLocation };
  }
}

// export async function loader({ request }: Route.LoaderArgs) {
//   let session = await getSession(request.headers.get('Cookie'));
//   if (!session.has('userId')) {
//     return redirect('/');
//   }
// }
