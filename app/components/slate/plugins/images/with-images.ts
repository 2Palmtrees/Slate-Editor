import imageExtensions from 'image-extensions';
import isUrl from 'is-url';
import { Transforms } from 'slate';

import type {
  CustomEditor,
  ImageElement,
  ParagraphElement,
} from '~/components/slate/custom-types';
import { isInImage } from './utils';

export default function withImages(editor: CustomEditor) {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    const { files } = data;

    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        const [mime] = file.type.split('/');

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result;
            insertImage(editor, url as string);
          });

          reader.readAsDataURL(file);
        }
      });
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
}

export function insertImage(editor: CustomEditor, url: string) {
  const text = { text: '' };
  const image: ImageElement = { type: 'image', url, children: [text] };

  if (isInImage(editor)) {
    return;
  }

  Transforms.insertNodes(editor, image);
  const paragraph: ParagraphElement = {
    type: 'paragraph',
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, paragraph);
}

export function setImage(editor: CustomEditor, url: string) {
  Transforms.setNodes(editor, { url });
}

export function isImageUrl(url: string): boolean {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split('.').pop();
  return imageExtensions.includes(ext!);
}
