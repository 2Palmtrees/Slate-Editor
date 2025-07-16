import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('image/upload', 'api/file-upload.ts'),
  route('image/:id', 'api/file.tsx'),
  route('image/:id/remove', 'api/file-remove.ts'),
  route('login', 'routes/login.tsx'),
  route('logout', 'routes/logout.tsx'),
] satisfies RouteConfig;
