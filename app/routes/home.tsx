import SlateEditor from '~/components/slate/editor';
import type { Route } from './+types/home';
import { Button, Container, Section } from '@radix-ui/themes';
import { Form } from 'react-router';
import { getSession } from '~/sessions.server';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');
  return { userId };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const serverData = await serverLoader();
  const clientData = localStorage.getItem('content');
  return {
    ...serverData,
    clientData,
  };
}
clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <p>Skeleton rendered during SSR</p>;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { clientData, userId } = loaderData;
  const isAdmin = userId === '1';

  return (
    <Container>
      {isAdmin ? (
        <Form action='/logout' method='post'>
          <Button type='submit' color='red'>
            Logout
          </Button>
        </Form>
      ) : (
        <Form action='/login' method='post'>
          <Button type='submit' color='green'>
            Login
          </Button>
        </Form>
      )}
      <Section >
        <SlateEditor content={clientData} isAdmin={isAdmin} />
      </Section>
    </Container>
  );
}
