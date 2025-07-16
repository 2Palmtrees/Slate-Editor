import { useSlate } from 'slate-react';
import { Button, DropdownMenu, Flex } from '@radix-ui/themes';
import { TableEditor } from '../slate-table/table-editor';
import type { CustomTableFormat } from '../../custom-types';
import { BoxIcon, CheckboxIcon } from '@radix-ui/react-icons';
import { isTableFormatActive, toggleTableFormat } from './utils';

export function TableMenu() {
  const editor = useSlate();

  return (
    <Flex gap='1'>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button type='button' variant='outline' radius='none'>
            Table
            <DropdownMenu.TriggerIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            onMouseDown={(event) => {
              TableEditor.insertTable(editor, { rows: 3, cols: 3 });
              event.preventDefault();
            }}
          >
            Insert table
          </DropdownMenu.Item>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Rows</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item
                onMouseDown={(event) => {
                  TableEditor.insertRow(editor, { before: true });
                  event.preventDefault();
                }}
              >
                Insert row above
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onMouseDown={(event) => {
                  TableEditor.insertRow(editor);
                  event.preventDefault();
                }}
              >
                Insert row below
              </DropdownMenu.Item>

              <DropdownMenu.Separator />
              <DropdownMenu.Item
                onMouseDown={(event) => {
                  TableEditor.removeRow(editor);
                  event.preventDefault();
                }}
                color='red'
              >
                Delete row
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Columns</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item
                onMouseDown={(event) => {
                  TableEditor.insertColumn(editor, { before: true });
                  event.preventDefault();
                }}
              >
                Insert column left
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onMouseDown={(event) => {
                  TableEditor.insertColumn(editor);
                  event.preventDefault();
                }}
              >
                Insert column right
              </DropdownMenu.Item>

              <DropdownMenu.Separator />
              <DropdownMenu.Item
                onMouseDown={(event) => {
                  TableEditor.removeColumn(editor);
                  event.preventDefault();
                }}
                color='red'
              >
                Delete column
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Align</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <Item format='tableAlign' label='Left' align='left' />
              <Item format='tableAlign' label='Center' align='center' />
              <Item format='tableAlign' label='Right' align='right' />
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator />

          <Item format='isStretched' label='Stretch' />
          <Item format='hasBackplate' label='Border' />
          <Item format='hasHeadings' label='Heading' />

          <DropdownMenu.Separator />

          <DropdownMenu.Item
            onMouseDown={(event) => {
              TableEditor.removeTable(editor);
              event.preventDefault();
            }}
            color='red'
          >
            Delete table
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  );
}

function Item({
  format,
  label,
  align,
}: {
  format: CustomTableFormat;
  label: string;
  align?: 'left' | 'right' | 'center';
}) {
  const editor = useSlate();
  const isActive = isTableFormatActive(editor, format, align);

  return (
    <DropdownMenu.Item
      onMouseDown={(event) => {
        event.preventDefault();
        toggleTableFormat(editor, format, isActive, align);
      }}
    >
      {isActive ? <CheckboxIcon /> : <BoxIcon />}
      {label}
    </DropdownMenu.Item>
  );
}
