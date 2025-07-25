import type { Route } from './+types/edit-item';
import type { Item } from './add-item';

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  let existingItems = localStorage.getItem('items');
  let updates: Item = await request.json();

  // console.log('updates', updates);

  if (existingItems) {
    let items: Item[] = await JSON.parse(existingItems);
    let ItemIndex = items.findIndex((item) => item.id === params.id);

    //Log object to Console.
    // console.log('Before update: ', items[ItemIndex]);

    items[ItemIndex] = { ...items[ItemIndex], ...updates };

    //Log object to console again.
    // console.log('After update: ', items[ItemIndex]);
    localStorage.setItem('items', JSON.stringify(items));
  }
}
