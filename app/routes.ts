import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('image/upload', 'api/file-upload.ts'),
  route('image/:id', 'api/file.ts'),
  route('image/:id/remove', 'api/file-remove.ts'),
  route('login', 'routes/login.ts'),
  route('logout', 'routes/logout.ts'),
] satisfies RouteConfig;
