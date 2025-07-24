import SlateEditor from '~/components/slate/editor';
import type { Route } from './+types/home';
import { Button, Flex } from '@radix-ui/themes';
import { useFetcher } from 'react-router';
import type { Item } from './add-item';

export async function clientLoader({}: Route.ClientLoaderArgs) {
  let data = localStorage.getItem('items');
  let items: Item[] = [];
  if (data) {
    items = await JSON.parse(data);
  }
  return { items };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  let { items } = loaderData;
  let fetcher = useFetcher();

  // console.log('items', items);

  return (
    <>
      {items.length > 0 ? (
        items.map((item) => <SlateEditor key={item.id} item={item} />)
      ) : (
        <Flex align='center' justify='center' my='2'>
          <fetcher.Form method='post' action='add'>
            <Button>Add an item</Button>
          </fetcher.Form>
        </Flex>
      )}
    </>
  );
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <p>Skeleton rendered during SSR</p>;
}
