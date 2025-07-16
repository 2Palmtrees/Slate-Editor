import type { InsertTableOptions, WithTableOptions } from "./plugins/slate-table/options";

export const LIST_TYPES = ['list', 'list-numbered', 'list-checks'] as const;
export const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'] as const;

export const DEFAULT_INSERT_TABLE_OPTIONS = {
  rows: 2,
  cols: 2,
} as const satisfies InsertTableOptions;

export const DEFAULT_WITH_TABLE_OPTIONS = {
  blocks: {
    td: 'table-cell',
    th: 'header-cell',
    content: 'paragraph',
    tr: 'table-row',
    table: 'table',
    tbody: 'table-body',
    tfoot: 'table-footer',
    thead: 'table-head',
  },
  withDelete: true,
  withFragments: true,
  withInsertText: true,
  withNormalization: true,
  withSelection: true,
  withSelectionAdjustment: true,
} as const satisfies WithTableOptions;
