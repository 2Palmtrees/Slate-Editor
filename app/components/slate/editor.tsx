import { useCallback, useMemo } from 'react';
import {
  Editable,
  Slate,
  withReact,
  type RenderElementProps,
  type RenderLeafProps,
} from 'slate-react';
import { createEditor, Node, type Descendant } from 'slate';
import * as R from '@radix-ui/themes';
import { withHistory } from 'slate-history';
import Toolbar, { type AlignType } from './toolbar';
import { isAlignElement } from './utils';
import { CheckIcon } from '@radix-ui/react-icons';
import { TableCursor, TableEditor, withTable } from './plugins/slate-table';
import { Table, Td } from './plugins/table/elements';
import withImages from './plugins/images/with-images';
import type { CustomEditor } from './custom-types';
import { Image } from './plugins/images/image';
import { withCorrectVoidBehavior } from './plugins/with-correct-void-behavior';
import { Figure } from './plugins/images/figure';
import isHotkey from 'is-hotkey';

export default function SlateEditor({
  content,
  isAdmin,
}: {
  content: string | null;
  isAdmin: boolean;
}) {
  const editor = useMemo(
    () =>
      withCorrectVoidBehavior(
        withImages(
          withTable(withHistory(withReact(createEditor())), {
            blocks: {
              table: 'table',
              thead: 'table-head',
              tbody: 'table-body',
              tfoot: 'table-footer',
              tr: 'table-row',
              th: 'header-cell',
              td: 'table-cell',
              content: 'paragraph',
            },
            withDelete: true,
            withFragments: true,
            withInsertText: true,
            withNormalization: true,
            withSelection: true,
            withSelectionAdjustment: true,
          })
        )
      ) as CustomEditor,
    []
  );

  const initialValue: Descendant[] = useMemo(
    () =>
      content
        ? JSON.parse(content)
        : [
            {
              type: 'paragraph',
              children: [{ text: 'A line of text in a paragraph.' }],
            },
            {
              type: 'image',
              url: 'https://avatars.githubusercontent.com/u/14073545',
              children: [{ text: '' }],
            },
            {
              type: 'table',
              children: [
                {
                  type: 'table-body',
                  children: [
                    {
                      type: 'table-row',
                      children: [
                        {
                          type: 'table-cell',
                          children: [
                            {
                              type: 'paragraph',
                              children: [
                                {
                                  text: 'Een',
                                },
                              ],
                            },
                          ],
                        },
                        {
                          type: 'table-cell',
                          children: [
                            {
                              type: 'paragraph',
                              children: [
                                {
                                  text: 'Twee',
                                },
                              ],
                            },
                          ],
                        },
                        {
                          type: 'table-cell',
                          children: [
                            {
                              type: 'paragraph',
                              children: [
                                {
                                  text: 'Drie',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'table-row',
                      children: [
                        {
                          type: 'table-cell',
                          children: [
                            {
                              type: 'paragraph',
                              children: [
                                {
                                  text: 'One',
                                },
                              ],
                            },
                          ],
                        },
                        {
                          type: 'table-cell',
                          children: [
                            {
                              type: 'paragraph',
                              children: [
                                {
                                  text: 'Two',
                                },
                              ],
                            },
                          ],
                        },
                        {
                          type: 'table-cell',
                          children: [
                            {
                              type: 'paragraph',
                              children: [
                                {
                                  text: 'Three',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },

                    {
                      type: 'table-row',
                      children: [
                        {
                          type: 'table-cell',
                          children: [
                            {
                              type: 'paragraph',
                              children: [
                                {
                                  text: 'Uno',
                                },
                              ],
                            },
                          ],
                        },
                        {
                          type: 'table-cell',
                          children: [
                            {
                              type: 'paragraph',
                              children: [
                                {
                                  text: 'Dos',
                                },
                              ],
                            },
                          ],
                        },
                        {
                          type: 'table-cell',
                          children: [
                            {
                              type: 'paragraph',
                              children: [
                                {
                                  text: 'Tres',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
    []
  );

  const HOTKEYS = useMemo(
    () => ({
      // Formatting
      BOLD: isHotkey('mod+b'),
      ITALIC: isHotkey('mod+i'),
      UNDERLINE: isHotkey('mod+u'),

      // Navigation
      ARROW_UP: isHotkey('up'),
      ARROW_DOWN: isHotkey('down'),
      ARROW_LEFT: isHotkey('left'),
      ARROW_RIGHT: isHotkey('right'),
      TAB: isHotkey('tab'),
      SHIFT_TAB: isHotkey('shift+tab'),
    }),
    []
  );

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => 'set_selection' !== op.type
        );
        if (isAstChange) {
          const content = JSON.stringify(value);
          localStorage.setItem('content', content);
        }
      }}
    >
      {isAdmin && <Toolbar />}
      <Editable
        readOnly={!isAdmin}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder='Enter some rich text…'
        spellCheck
        autoFocus
        style={{ padding: '1rem' }}
        onKeyDown={(event) => {
          // Prevent inserting another 'figcaption' if in it and Enter is pressed.
          if (event.key === 'Enter') {
            const selectedElement = Node.descendant(
              editor,
              editor.selection.anchor.path.slice(0, -1)
            );
            if (selectedElement.type === 'figcaption') {
              event.preventDefault();
            }
          }
          if (TableCursor.isInTable(editor)) {
            switch (true) {
              case HOTKEYS.ARROW_DOWN(event) &&
                TableCursor.isOnEdge(editor, 'bottom'):
                event.preventDefault();
                return TableCursor.downward(editor);
              case HOTKEYS.ARROW_UP(event) &&
                TableCursor.isOnEdge(editor, 'top'):
                event.preventDefault();
                return TableCursor.upward(editor);
              case HOTKEYS.ARROW_RIGHT(event) &&
                TableCursor.isOnEdge(editor, 'end'):
                event.preventDefault();
                return TableCursor.forward(editor);
              case HOTKEYS.ARROW_LEFT(event) &&
                TableCursor.isOnEdge(editor, 'start'):
                event.preventDefault();
                return TableCursor.backward(editor);
              case HOTKEYS.TAB(event):
                if (TableCursor.isInLastCell(editor)) {
                  TableEditor.insertRow(editor);
                }
                event.preventDefault();
                return TableCursor.forward(editor, { mode: 'all' });
              case HOTKEYS.SHIFT_TAB(event):
                event.preventDefault();
                return TableCursor.backward(editor, { mode: 'all' });
            }
          }
        }}
      />
    </Slate>
  );
}

function Element({ attributes, children, element }: RenderElementProps) {
  const props = { attributes, children, element };
  const style: React.CSSProperties = {};
  if (isAlignElement(element)) {
    style.textAlign = element.align as AlignType;
  }
  switch (element.type) {
    case 'heading-one':
      return (
        <R.Heading as='h1' size='9' mb='2' style={style} {...attributes}>
          {children}
        </R.Heading>
      );
    case 'heading-two':
      return (
        <R.Heading as='h2' size='8' mb='2' style={style} {...attributes}>
          {children}
        </R.Heading>
      );
    case 'heading-three':
      return (
        <R.Heading as='h3' size='7' mb='2' style={style} {...attributes}>
          {children}
        </R.Heading>
      );
    case 'list':
      return (
        <ul style={style} {...attributes} className='list-disc list-inside'>
          {children} {element.align}
        </ul>
      );
    case 'list-numbered':
      return (
        <ol style={style} {...attributes} className='list-decimal list-inside'>
          {children}
        </ol>
      );
    case 'list-checks':
      return (
        <ul style={style} {...attributes} className='list-none list-inside'>
          {children}
        </ul>
      );
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case 'list-checks-item': {
      let align = element.align;
      return (
        <R.Flex
          asChild
          align='center'
          gap='1'
          justify={
            align === 'center'
              ? 'center'
              : align === 'right'
              ? 'end'
              : undefined
          }
        >
          <li style={style} {...attributes}>
            <CheckIcon color='var(--accent-11)' />
            {children}
          </li>
        </R.Flex>
      );
    }

    // TABLE
    case 'table':
      return <Table props={props} />;
    case 'table-head':
      return <R.Table.Header {...attributes}>{children}</R.Table.Header>;
    case 'table-body':
      return (
        <R.Table.Body className='' {...attributes} style={style}>
          {children}
        </R.Table.Body>
      );
    case 'table-footer':
      return (
        <tfoot className='' {...attributes}>
          {children}
        </tfoot>
      );
    case 'table-row':
      return <R.Table.Row {...attributes}>{children}</R.Table.Row>;
    case 'header-cell':
      return (
        <R.Table.ColumnHeaderCell style={style} {...attributes}>
          {children}
        </R.Table.ColumnHeaderCell>
      );
    case 'table-cell':
      return <Td className='' {...props} />;

    // IMAGE
    case 'image':
      return <Image props={props} />;
    case 'figure':
      return <Figure props={props} />;
    case 'figcaption':
      return (
        <R.Flex
          style={{
            borderRadius: 'var(--radius-2)',
            border: '1px solid var(--gray-6)',
          }}
          {...attributes}
          asChild
          p='2'
        >
          <figcaption>
            <R.Text as='p' color='gray' size='2'>
              {children}
            </R.Text>
          </figcaption>
        </R.Flex>
      );
    default:
      return (
        <R.Text style={style} {...attributes}>
          {children}
        </R.Text>
      );
  }
}

function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  if (leaf.bold) {
    children = <R.Strong>{children}</R.Strong>;
  }
  if (leaf.italic) {
    children = <R.Em>{children}</R.Em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.strikethrough) {
    children = <s>{children}</s>;
  }
  if (leaf.code) {
    children = <R.Code>{children}</R.Code>;
  }
  if (leaf.quote) {
    children = <R.Quote>{children}</R.Quote>;
  }
  return <R.Text {...attributes}>{children}</R.Text>;
}
