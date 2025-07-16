import { Flex, IconButton } from '@radix-ui/themes';
import * as L from 'lucide-react';
import type { CustomElementType, CustomTextKey } from './custom-types';
import { useSlate, useSlateStatic } from 'slate-react';
import {
  isAlignType,
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
} from './utils';
import type { LIST_TYPES, TEXT_ALIGN_TYPES } from './constants';
import { HistoryEditor } from 'slate-history';
import { TableMenu } from './plugins/table/table-menu';
import InsertImageButton from './plugins/images/upsert-image-dialog';

export type AlignType = (typeof TEXT_ALIGN_TYPES)[number];
export type ListType = (typeof LIST_TYPES)[number];
export type CustomElementFormat = CustomElementType | AlignType | ListType;

export default function Toolbar() {
  const editor = useSlateStatic();
  return (
    <Flex
      gap='1'
      p='2'
      mb='2'
      align='center'
      wrap='wrap'
      style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--accent-3)',
        zIndex: '999',
        boxShadow: '0 0 0 1px var(--accent-6)',
        borderRadius: 'var(--radius-1)',
      }}
    >
      <MarkButton format='bold'>
        <L.Bold width='18' height='18' />
      </MarkButton>
      <MarkButton format='italic'>
        <L.Italic width='18' height='18' />
      </MarkButton>
      <MarkButton format='underline'>
        <L.Underline width='18' height='18' />
      </MarkButton>
      <MarkButton format='strikethrough'>
        <L.Strikethrough width='18' height='18' />
      </MarkButton>
      <MarkButton format='code'>
        <L.Code width='18' height='18' />
      </MarkButton>
      <MarkButton format='quote'>
        <L.Quote width='18' height='18' />
      </MarkButton>

      <BlockButton format='heading-one'>
        <L.Heading1 width='18' height='18' />
      </BlockButton>
      <BlockButton format='heading-two'>
        <L.Heading2 width='18' height='18' />
      </BlockButton>
      <BlockButton format='heading-three'>
        <L.Heading3 width='18' height='18' />
      </BlockButton>

      <BlockButton format='list'>
        <L.List width='18' height='18' />
      </BlockButton>
      <BlockButton format='list-numbered'>
        <L.ListOrdered width='18' height='18' />
      </BlockButton>
      <BlockButton format='list-checks'>
        <L.ListChecks width='18' height='18' />
      </BlockButton>

      <BlockButton format='left'>
        <L.AlignLeft width='18' height='18' />
      </BlockButton>
      <BlockButton format='center'>
        <L.AlignCenter width='18' height='18' />
      </BlockButton>
      <BlockButton format='right'>
        <L.AlignRight width='18' height='18' />
      </BlockButton>
      <BlockButton format='justify'>
        <L.AlignJustify width='18' height='18' />
      </BlockButton>

      <TableMenu />
      <InsertImageButton />
      <IconButton
        type='button'
        variant='outline'
        onMouseDown={(event) => {
          event.preventDefault();
          HistoryEditor.undo(editor);
        }}
      >
        <L.Undo />
      </IconButton>
    </Flex>
  );
}

function MarkButton({
  format,
  children,
}: {
  format: CustomTextKey;
  children: React.ReactNode;
}) {
  const editor = useSlate();
  const active = isMarkActive(editor, format);
  return (
    <IconButton
      variant={active ? 'solid' : 'outline'}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {children}
    </IconButton>
  );
}

function BlockButton({
  format,
  children,
}: {
  format: CustomElementFormat;
  children: React.ReactNode;
}) {
  const editor = useSlate();
  const active = isBlockActive(
    editor,
    format,
    isAlignType(format) ? 'align' : 'type'
  );
  return (
    <IconButton
      variant={active ? 'solid' : 'outline'}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {children}
    </IconButton>
  );
}
