import { Editor, Element, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import type {
  CustomEditor,
  CustomElementType,
} from '~/components/slate/custom-types';

export const IMAGE_STYLES = [
  'align-left',
  'align-center',
  'align-right',
  'stretch',
  'float-left',
  'float-right',
] as const;

type ImageStyleType = (typeof IMAGE_STYLES)[number];
export type CustomImageElementFormat = CustomElementType | ImageStyleType;

export function isInImage(editor: CustomEditor,) {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      (n.type === 'figure' || n.type === 'image' || n.type === 'table'),
  });
  if (match !== undefined) {
    return true;
  } else {
    return false;
  }
}

export function isImageBlockActive(
  editor: CustomEditor,
  format: CustomImageElementFormat,
  blockType: 'type' | 'style' = 'type'
) {
  const { selection } = editor;
  if (!selection) return false;
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => {
        if (
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          (n.type === 'image' || n.type === 'figure')
        ) {
          if (blockType === 'style' && n.type !== 'figure') {
            return n.style === format;
          }
          return n.type === format;
        }
        return false;
      },
    })
  );
  return !!match;
}

export function toggleImageBlock(
  editor: CustomEditor,
  format: CustomImageElementFormat
) {
  const isActive = isImageBlockActive(
    editor,
    format,
    isImageStyleType(format) ? 'style' : 'type'
  );

  const isFigure = format === 'figure';

  if (isActive && isFigure) {
    const [figure] = Editor.nodes(editor, {
      match: (node) => Element.isElementType(node, 'figure'),
    });
    Transforms.removeNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === 'figcaption',
      at: [figure[1], 1],
    });
  }

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      n.type === 'figure' &&
      !isImageStyleType(format),
    split: true,
  });

  let newProperties: Partial<Element>;

  if (isImageStyleType(format)) {
    newProperties = {
      style: isActive ? undefined : format,
    };
  }

  Transforms.setNodes<Element>(editor, newProperties);

  if (!isActive && isFigure) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
    Transforms.insertNodes(editor, {
      type: 'figcaption',
      children: [{ text: 'Caption' }],
    });
  }
}

export function isImageStyleType(
  format: CustomImageElementFormat
): format is ImageStyleType {
  return IMAGE_STYLES.includes(format as ImageStyleType);
}
