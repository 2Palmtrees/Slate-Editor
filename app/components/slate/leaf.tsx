import { Code, Em, Quote, Strong, Text } from '@radix-ui/themes';
import type { RenderLeafProps } from 'slate-react';

export default function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  if (leaf.bold) {
    children = <Strong>{children}</Strong>;
  }
  if (leaf.italic) {
    children = <Em>{children}</Em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.strikethrough) {
    children = <s>{children}</s>;
  }
  if (leaf.code) {
    children = <Code>{children}</Code>;
  }
  if (leaf.quote) {
    children = <Quote>{children}</Quote>;
  }
  return <Text {...attributes}>{children}</Text>;
}
