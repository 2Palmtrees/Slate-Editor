import {
  MaxFilesExceededError,
  MaxFileSizeExceededError,
  parseFormData,
  type FileUpload,
} from '@mjackson/form-data-parser';
import { fileStorage, getStorageKey } from '~/image-storage.server';
import * as crypto from 'node:crypto';
import { data, type ActionFunctionArgs } from 'react-router';

export async function action({ request }: ActionFunctionArgs) {
  let imageId;
  const uploadHandler = async (fileUpload: FileUpload) => {
    if (
      fileUpload.fieldName === 'image' &&
      fileUpload.type.startsWith('image/')
    ) {
      imageId = crypto.randomBytes(20).toString('hex');
      let storageKey = getStorageKey(imageId);
      await fileStorage.set(storageKey, fileUpload);
      return fileStorage.get(storageKey);
    }
  };
  const errors = {};
  try {
    let formData = await parseFormData(
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
      errors.image = 'An unknown error occurred';
    }
  }

  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  } else {
    // const file = formData.get('image');
    // console.log('File', file, imageId);
    return { imageId };
  }
}
