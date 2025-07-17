import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('image/upload', 'api/file-upload.ts'),
  route('image/:storageKey', 'api/file.ts'),
  route('image/:storageKey/remove', 'api/file-remove.ts'),
  route('login', 'routes/login.ts'),
  route('logout', 'routes/logout.ts'),
] satisfies RouteConfig;
