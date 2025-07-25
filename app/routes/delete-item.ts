import type { Route } from './+types/delete-item';
import type { Item } from './add-item';

export async function clientAction({ params }: Route.ActionArgs) {
  let existingItems = localStorage.getItem('items');

  if (existingItems) {
    let items: Item[] = await JSON.parse(existingItems);

    let newItems = items.filter((item) => item.id !== params.id);

    localStorage.setItem('items', JSON.stringify(newItems));
  }
}
