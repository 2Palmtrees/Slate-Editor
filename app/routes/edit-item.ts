import type { Route } from './+types/edit-item';
import type { Item } from './add-item';

export async function clientAction({ request }: Route.ClientActionArgs) {
  let existingItems = localStorage.getItem('items');
  let updates: Item = await request.json();

  console.log('updates', updates);

  if (existingItems) {
    let items: Item[] = await JSON.parse(existingItems);

    //Find index of specific object using findIndex method.
    let ItemIndex = items.findIndex((item) => item.id === updates.id);

    //Log object to Console.
    console.log('Before update: ', items[ItemIndex]);

    //Update object's name property.
    items[ItemIndex] = { ...items[ItemIndex], ...updates };

    //Log object to console again.
    console.log('After update: ', items[ItemIndex]);
    localStorage.setItem('items', JSON.stringify(items));
  }
}
