import { Editor, Element, Transforms } from 'slate';
import type {
  CustomEditor,
  CustomElement,
  CustomElementWithAlign,
  CustomTextKey,
} from './custom-types';
import { LIST_TYPES, TEXT_ALIGN_TYPES } from './constants';
import type { AlignType, CustomElementFormat, ListType } from './toolbar';
import { ReactEditor } from 'slate-react';

export function isMarkActive(editor: CustomEditor, format: CustomTextKey) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}
export function toggleMark(editor: CustomEditor, format: CustomTextKey) {
  const isActive = isMarkActive(editor, format);

  if (ReactEditor.isReadOnly(editor)) {
    return;
  }

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

export function isBlockActive(
  editor: CustomEditor,
  format: CustomElementFormat,
  blockType: 'type' | 'align' = 'type'
) {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => {
        if (!Editor.isEditor(n) && Element.isElement(n)) {
          if (blockType === 'align' && isAlignElement(n)) {
            return n.align === format;
          }
          return n.type === format;
        }
        return false;
      },
    })
  );

  return !!match;
}
export function toggleBlock(editor: CustomEditor, format: CustomElementFormat) {
  const isActive = isBlockActive(
    editor,
    format,
    isAlignType(format) ? 'align' : 'type'
  );
  const isList = isListType(format);
  const isListChecks = format === 'list-checks';

  if (ReactEditor.isReadOnly(editor)) {
    return;
  }

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      isListType(n.type) &&
      !isAlignType(format),
    split: true,
  });

  let newProperties: Partial<Element>;
  if (isAlignType(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive
        ? 'paragraph'
        : isList && isListChecks
        ? 'list-checks-item'
        : isList
        ? 'list-item'
        : format,
    };
  }

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

export function isAlignType(format: CustomElementFormat): format is AlignType {
  return TEXT_ALIGN_TYPES.includes(format as AlignType);
}

export function isListType(format: CustomElementFormat): format is ListType {
  return LIST_TYPES.includes(format as ListType);
}

export function isAlignElement(
  element: CustomElement
): element is CustomElementWithAlign {
  return 'align' in element;
}
