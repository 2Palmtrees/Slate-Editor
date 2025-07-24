import {
  type RouteConfig,
  index,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
    route('add','routes/add-item.ts'),
    route('edit','routes/edit-item.ts'),
    route('delete','routes/delete-item.ts'),
  ...prefix('image', [
    route('upload', 'api/image-upload.ts'),
    route(':storageKey', 'api/image.ts'),
    route(':imageLocation/remove', 'api/image-remove.ts'),
  ]),
] satisfies RouteConfig;
