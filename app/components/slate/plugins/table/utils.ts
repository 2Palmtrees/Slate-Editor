import { Editor, Element, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import type {
  CustomEditor,
  CustomTableFormat,
} from '~/components/slate/custom-types';

export function toggleTableHeader(
  editor: CustomEditor,
  path: Path,
  isActive: boolean
) {
  console.log('path', path);
  console.log('at', [path[0], 1]);

  if (!isActive) {
    const [tableRow] = Editor.nodes(editor, {
      at: path,
      match: (n) => {
        if (
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === 'table-row'
        ) {
          return true;
        }
        return false;
      },
    });
    const cols = tableRow[0].children.length;

    // number of rows and cols can't be less than 1
    const clamp = (n: number) => (n < 1 ? 1 : n);

    Transforms.insertNodes(
      editor,
      {
        type: 'table-head',
        children: [
          {
            type: 'table-row',
            children: Array.from({ length: clamp(cols) }).map(() => ({
              type: 'header-cell',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'head' }],
                },
              ],
            })),
          },
        ],
      },
      {
        at: [path[0], 1],
      }
    );
  } else {
    Transforms.removeNodes(editor, {
      match: (node) => node.type === 'table-head',
      at: path,
    });
    console.log('remove header');
  }
}

export function isTableFormatActive(
  editor: CustomEditor,
  format: CustomTableFormat,
  align?: 'left' | 'right' | 'center'
) {
  const [match] = Editor.nodes(editor, {
    match: (n) => {
      if (!Editor.isEditor(n) && Element.isElement(n) && n.type === 'table') {
        switch (format) {
          case 'hasBackplate':
            return n.hasBackplate ? true : false;
          case 'isStretched':
            return n.isStretched ? true : false;
          case 'hasHeadings':
            return n.hasHeadings ? true : false;
          case 'tableAlign':
            return n.tableAlign === align;
          default:
            break;
        }
      }
      return false;
    },
  });
  return !!match;
}

export function toggleTableFormat(
  editor: Editor,
  format: CustomTableFormat,
  isActive: boolean,
  align?: 'left' | 'right' | 'center'
) {
  const [table] = Editor.nodes(editor, {
    match: (node) => Element.isElementType(node, 'table'),
  });

  if (!table) {
    return;
  }
  if (ReactEditor.isReadOnly(editor)) {
    return;
  }

  console.log('Table', table);

  const [, path] = table;
  console.log('table', table[0].children);

  function tableFormat() {
    switch (format) {
      case 'hasBackplate':
        Transforms.setNodes(
          editor,
          { hasBackplate: !isActive },
          {
            at: path,
            match: (n) =>
              !Editor.isEditor(n) &&
              Element.isElement(n) &&
              (n.type === 'table-cell' || n.type === 'header-cell'),
          }
        );
        return { hasBackplate: !isActive };
      case 'isStretched':
        return { isStretched: !isActive };
      case 'hasHeadings': {
        toggleTableHeader(editor, path, isActive);
        return { hasHeadings: !isActive };
      }
      case 'tableAlign': {
        return { tableAlign: align };
      }
      default:
        return {};
    }
  }
  Transforms.setNodes(editor, tableFormat(), {
    at: path,
  });
}
