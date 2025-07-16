import type { FC } from 'react';
import {
  useSlateSelection,
  useSlateStatic,
  type RenderElementProps,
  type RenderLeafProps,
} from 'slate-react';
import { TableCursor } from '../slate-table/table-cursor';
import * as R from '@radix-ui/themes';
import { isAlignElement } from '~/components/slate/utils';
import type { AlignType } from '~/components/slate/toolbar';

export function Table({ props }: { props: RenderElementProps }) {
  const { attributes, children, element } = props;
  if (element.type !== 'table') {
    throw new Error('Element "Table" must be of type "table"');
  }
  const editor = useSlateStatic();
  const [isSelecting] = TableCursor.selection(editor);

  return (
    <R.Flex
      my='2'
      justify={
        element.tableAlign === 'center'
          ? 'center'
          : element.tableAlign === 'right'
          ? 'end'
          : 'start'
      }
    >
      <R.Box
        width={{ initial: '100%', sm: element.isStretched ? '100%' : '50%' }}
      >
        <R.Table.Root
          variant={element.hasBackplate ? 'surface' : 'ghost'}
          style={{
            background: !isSelecting ? 'none' : '',
          }}
          {...attributes}
        >
          {children}
        </R.Table.Root>
      </R.Box>
    </R.Flex>
  );
}

export const Th: FC<RenderElementProps & { className: string }> = ({
  attributes,
  children,
  className,
  element,
}) => {
  if (element.type !== 'header-cell') {
    throw new Error('Element "Th" must be of type "header-cell"');
  }
  const style: React.CSSProperties = {};
  if (isAlignElement(element)) {
    style.textAlign = element.align as AlignType;
  }

  useSlateSelection();
  const editor = useSlateStatic();
  const selected = TableCursor.isSelected(editor, element);

  return (
    <th
      className={`${selected ? 'bg-sky-200' : ''} ${className}`}
      rowSpan={element.rowSpan}
      colSpan={element.colSpan}
      {...attributes}
      style={style}
    >
      {children}
    </th>
  );
};

export const Td: FC<RenderElementProps & { className: string }> = ({
  attributes,
  children,
  className,
  element,
}) => {
  if (element.type !== 'table-cell') {
    throw new Error('Element "Td" must be of type "table-cell"');
  }

  useSlateSelection();
  const editor = useSlateStatic();
  const selected = TableCursor.isSelected(editor, element);
  const style: React.CSSProperties = {};
  if (isAlignElement(element)) {
    style.textAlign = element.align as AlignType;
  }

  return (
    <R.Table.Cell
      className={`${selected ? 'bg-sky-200' : ''} ${className}`}
      rowSpan={element.rowSpan}
      colSpan={element.colSpan}
      {...attributes}
      style={style}
    >
      {children}
    </R.Table.Cell>
  );
};

export const Text: FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};
