import type { RenderElementProps } from 'slate-react';
import type { AlignType } from './toolbar';
import * as R from '@radix-ui/themes';
import { isAlignElement } from './utils';
import { Image } from './plugins/images/image';
import { Figure } from './plugins/images/figure';
import { CheckIcon } from '@radix-ui/react-icons';

export default function Element({
  attributes,
  children,
  element,
}: RenderElementProps) {
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
      return (
        <R.Flex
          {...attributes}
          style={style}
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
            width={{
              initial: '100%',
              sm: element.isStretched ? '100%' : '50%',
            }}
          >
            <R.Table.Root
              variant={element.hasBackplate ? 'surface' : 'ghost'}
              style={{
                backgroundColor: element.hasBackplate
                  ? 'var(--gray-1)'
                  : 'unset',
              }}
            >
              {children}
            </R.Table.Root>
          </R.Box>
        </R.Flex>
      );
    case 'table-head':
      return (
        <R.Table.Header {...attributes} style={style}>
          {children}
        </R.Table.Header>
      );
    case 'table-body':
      return (
        <R.Table.Body {...attributes} style={style}>
          {children}
        </R.Table.Body>
      );
    case 'table-footer':
      return (
        <tfoot {...attributes} style={style}>
          {children}
        </tfoot>
      );
    case 'table-row':
      return (
        <R.Table.Row {...attributes} style={style}>
          {children}
        </R.Table.Row>
      );
    case 'header-cell':
      return (
        <R.Table.ColumnHeaderCell
          {...attributes}
          // style={style}
          style={{
            boxShadow:
              element.invert && !element.hasBackplate
                ? 'inset 0 -1px var(--gray-1)'
                : 'inset 0 -1px var(--gray-a5)',
            color:
              element.invert && !element.hasBackplate
                ? 'var(--gray-1)'
                : 'var(--gray-12)',
          }}
        >
          {children}
        </R.Table.ColumnHeaderCell>
      );
    case 'table-cell':
      return (
        <R.Table.Cell
          {...attributes}
          // style={style}
          style={{
            boxShadow:
              element.invert && !element.hasBackplate
                ? 'inset 0 -1px var(--gray-1)'
                : 'inset 0 -1px var(--gray-a5)',
            color:
              element.invert && !element.hasBackplate
                ? 'var(--gray-1)'
                : 'var(--gray-12)',
          }}
        >
          {children}
        </R.Table.Cell>
      );

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
    case 'paragraph':
      return (
        <R.Text as='p' style={style} {...attributes}>
          {children}
        </R.Text>
      );
    default:
      return (
        <R.Text style={style} {...attributes}>
          {children}
        </R.Text>
      );
  }
}
