import type { BaseEditor, Descendant } from 'slate';
import type { HistoryEditor } from 'slate-history';
import type { ReactEditor, RenderElementProps } from 'slate-react';

export type BlockQuoteElement = {
  type: 'block-quote';
  align?: string;
  children: Descendant[];
};

export type CheckListItemElement = {
  type: 'check-list-item';
  checked: boolean;
  children: Descendant[];
};

export type EditableVoidElement = {
  type: 'editable-void';
  children: EmptyText[];
};

export type HeadingElement = {
  type: 'heading-one';
  align?: string;
  children: Descendant[];
};

export type HeadingTwoElement = {
  type: 'heading-two';
  align?: string;
  children: Descendant[];
};

export type HeadingThreeElement = {
  type: 'heading-three';
  align?: string;
  children: Descendant[];
};

export type HeadingFourElement = {
  type: 'heading-four';
  align?: string;
  children: Descendant[];
};

export type HeadingFiveElement = {
  type: 'heading-five';
  align?: string;
  children: Descendant[];
};

export type HeadingSixElement = {
  type: 'heading-six';
  align?: string;
  children: Descendant[];
};

export type LinkElement = { type: 'link'; url: string; children: Descendant[] };

export type ButtonElement = { type: 'button'; children: Descendant[] };

export type BadgeElement = { type: 'badge'; children: Descendant[] };

export type ListElement = {
  type: 'list';
  align?: string;
  children: Descendant[];
};

export type ListNumberedElement = {
  type: 'list-numbered';
  children: Descendant[];
};
export type ListChecksElement = {
  type: 'list-checks';
  children: Descendant[];
};

export type ListItemElement = { type: 'list-item'; children: Descendant[] };

export type ListChecksItemElement = {
  type: 'list-checks-item';
  align?: string;
  children: Descendant[];
};

export type MentionElement = {
  type: 'mention';
  character: string;
  children: CustomText[];
};

export type TitleElement = { type: 'title'; children: Descendant[] };

export type VideoElement = {
  type: 'video';
  url: string;
  children: EmptyText[];
};

export type CodeBlockElement = {
  type: 'code-block';
  language: string;
  children: Descendant[];
};

export type CodeLineElement = {
  type: 'code-line';
  children: Descendant[];
};

export type ParagraphElement = {
  type: 'paragraph';
  align?: string;
  children: Descendant[];
};

// IMAGE
export type ImageElement = {
  type: 'image';
  url: string;
  style?: string;
  children: EmptyText[];
};
export type FigureElement = {
  type: 'figure';
  children: ImageElement & FigureCaptionElement;
};
export type FigureCaptionElement = {
  type: 'figcaption';
  align?: string;
  children: CustomText[];
};

// TABLE
export interface Table {
  type: 'table';
  tableAlign?: string;
  isStretched?: boolean;
  hasBackplate?: boolean;
  hasHeadings?: boolean;
  children: Descendant[];
}
export interface TableHead {
  type: 'table-head';
  children: Descendant[];
}
export interface TableBody {
  type: 'table-body';
  children: Descendant[];
}
export interface TableFooter {
  type: 'table-footer';
  children: Descendant[];
}
export interface Tr {
  type: 'table-row';
  children: Descendant[];
}
export interface Th {
  type: 'header-cell';
  invert?: boolean;
  hasBackplate?: boolean;
  align?: string;
  rowSpan?: number;
  colSpan?: number;
  children: Descendant[];
}
export interface Td {
  type: 'table-cell';
  invert?: boolean;
  hasBackplate?: boolean;
  align?: string;
  rowSpan?: number;
  colSpan?: number;
  children: Descendant[];
}

export type CustomElementWithAlign =
  | ParagraphElement
  | HeadingElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement
  | BlockQuoteElement
  | ListElement
  | ListChecksItemElement
  | ImageElement
  | FigureCaptionElement;

type CustomElement =
  | BlockQuoteElement
  | CheckListItemElement
  | EditableVoidElement
  | HeadingElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement
  | ImageElement
  | FigureElement
  | FigureCaptionElement
  | LinkElement
  | ButtonElement
  | BadgeElement
  | ListElement
  | ListNumberedElement
  | ListChecksElement
  | ListItemElement
  | ListChecksItemElement
  | MentionElement
  | ParagraphElement
  | TitleElement
  | VideoElement
  | CodeBlockElement
  | CodeLineElement
  | Table
  | TableHead
  | TableBody
  | TableFooter
  | Tr
  | Th
  | Td;

export type CustomElementType = CustomElement['type'];

export type CustomText = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  quote?: boolean;
  // MARKDOWN PREVIEW SPECIFIC LEAF
  underlined?: boolean;
  title?: boolean;
  list?: boolean;
  hr?: boolean;
  blockquote?: boolean;
  text: string;
};

export type CustomTextKey = keyof Omit<CustomText, 'text'>;

export type CustomTableFormat = keyof Omit<Table, 'type' | 'children'>;
export type CustomImageFormat = keyof Omit<ImageElement, 'type' | 'children'>;

export type EmptyText = {
  text: string;
};

export type RenderElementPropsFor<T> = RenderElementProps & {
  element: T;
};

type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    nodeToDecorations?: Map<Element, Range[]>;
  };

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
    Range: BaseRange & {
      [key: string]: unknown;
    };
  }
}
