import type { Descendant } from 'slate';

export type Item = {
  id: string;
  content: Descendant[];
  hasBackground: boolean;
};

export async function clientAction() {
  let existingItems = localStorage.getItem('items');
  let newItem: Item = {
    id: self.crypto.randomUUID(),
    content: [
      {
        type: 'paragraph',
        children: [{ text: 'Some text...' }],
      },
    ],
    hasBackground: false,
  };
  let newItems: Item[];

  newItems = existingItems
    ? [...JSON.parse(existingItems), newItem]
    : [newItem];

  localStorage.setItem('items', JSON.stringify(newItems));
  // return { newItem };
}
