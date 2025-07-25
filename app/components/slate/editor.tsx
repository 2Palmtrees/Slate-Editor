import { useCallback, useMemo, useState } from 'react';
import {
  Editable,
  Slate,
  withReact,
  type RenderElementProps,
  type RenderLeafProps,
} from 'slate-react';
import {
  createEditor,
  Editor,
  Node,
  Element as SlateElement,
  Transforms,
} from 'slate';
import * as R from '@radix-ui/themes';
import { withHistory } from 'slate-history';
import Toolbar from './toolbar';
import { TableCursor, TableEditor, withTable } from './plugins/slate-table';
import withImages from './plugins/images/with-images';
import type { CustomEditor } from './custom-types';
import { withCorrectVoidBehavior } from './plugins/with-correct-void-behavior';
import isHotkey from 'is-hotkey';
import { useFetcher } from 'react-router';
import type { Item } from '~/routes/add-item';
import Element from './element';
import Leaf from './leaf';

export default function SlateEditor({ item }: { item: Item }) {
  let fetcher = useFetcher();
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [hasBackground, setHasBackground] = useState(item.hasBackground);

  // console.log('hasBackground:', hasBackground);

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

  async function changeBackground() {
    await fetcher.submit(
      JSON.stringify({
        hasBackground: !hasBackground,
      }),
      {
        method: 'put',
        action: `${item.id}/edit`,
        encType: 'application/json',
      }
    );

    setHasBackground((prev) => !prev);

    // Invert colors on some table elements.
    Transforms.setNodes(
      editor,
      { invert: !hasBackground },
      {
        at: [],
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          (n.type === 'table-cell' || n.type === 'header-cell'),
      }
    );
  }

  return (
    <Slate
      editor={editor}
      initialValue={item.content}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => 'set_selection' !== op.type
        );
        if (isAstChange) {
          let updates: Partial<Item> = {
            content: value,
          };
          fetcher.submit(JSON.stringify(updates), {
            method: 'put',
            action: `${item.id}/edit`,
            encType: 'application/json',
          });
        }
      }}
    >
      {!isReadOnly && <Toolbar />}
      <R.Container
        style={{
          background: hasBackground ? 'var(--accent-9)' : 'unset',
          color: hasBackground ? 'var(--gray-1)' : 'unset',
        }}
      >
        <R.Section>
          <R.Flex gap='2' mb='2'>
            <R.Button
              onClick={() => setIsReadOnly(!isReadOnly)}
              color={isReadOnly ? 'green' : 'crimson'}
            >
              {isReadOnly ? 'Edit' : 'Save'}
            </R.Button>
            <R.Button variant='surface' onClick={() => changeBackground()}>
              {hasBackground ? 'Remove Background' : 'Set Background'}
            </R.Button>
            <fetcher.Form
              method='post'
              action={`${item.id}/delete`}
              onSubmit={(event) => {
                const response = confirm(
                  'Please confirm you want to delete this record.'
                );
                if (!response) {
                  event.preventDefault();
                }
              }}
            >
              <R.Button variant='surface'>Delete</R.Button>
            </fetcher.Form>
          </R.Flex>
          <Editable
            readOnly={isReadOnly}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
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
        </R.Section>
      </R.Container>
    </Slate>
  );
}
