import { TrashIcon } from '@radix-ui/react-icons';
import * as R from '@radix-ui/themes';
import { useState } from 'react';
import { useFetcher } from 'react-router';
import { Editor, Element, Transforms } from 'slate';
import {
  ReactEditor,
  useSlateStatic,
  type RenderElementProps,
} from 'slate-react';
import UpsertImageButton from './upsert-image-dialog';
import StyleImageDialog from './style-image-dialog';
import type { ImageSizes } from '~/api/sharpen';

export function Image({ props }: { props: RenderElementProps }) {
  const { attributes, children, element } = props;
  if (element.type !== 'image') {
    throw new Error('Element "Image" must be of type "image"');
  }
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);
  const [figure] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isAncestor(n) && n.type === 'figure',
    at: path,
  });

  const isReadOnly = ReactEditor.isReadOnly(editor);
  const [over, setOver] = useState(false);
  const fetcher = useFetcher();

  let imageLocation = element.url.split('/').pop();
  let imageSize: ImageSizes = 'medium';
  if (element.style === 'stretch') {
    imageSize = 'large';
  }
  let imageSrc = `${element.url}-${imageSize}`;

  return (
    <R.Flex
      {...attributes}
      contentEditable={false}
      justify={
        figure !== undefined
          ? 'start'
          : element.style === 'align-center'
          ? 'center'
          : element.style === 'align-right'
          ? 'end'
          : 'start'
      }
      my={figure === undefined ? '2' : '0'}
      mr={element.style === 'float-left' && figure === undefined ? '2' : '0'}
      ml={element.style === 'float-right' && figure === undefined ? '2' : '0'}
      width={{
        initial: '100%',
        sm:
          figure !== undefined ||
          element.style === 'stretch' ||
          element.style === 'align-left' ||
          element.style === 'align-center' ||
          element.style === 'align-right' ||
          element.style === undefined
            ? '100%'
            : '50%',
      }}
      style={{
        float:
          element.style === 'float-left'
            ? 'left'
            : element.style === 'float-right'
            ? 'right'
            : 'none',
      }}
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
    >
      <R.Flex
        style={{
          position: 'relative',
          cursor: 'default',
        }}
        direction='column'
        gap='2'
        width={{
          initial: '100%',
          sm:
            figure !== undefined ||
            element.style === 'stretch' ||
            element.style === 'float-right' ||
            element.style === 'float-left'
              ? '100%'
              : '50%',
        }}
      >
        {children}
        <img
          src={imageSrc}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            borderRadius: 'var(--radius-2)',
          }}
        />
        {!isReadOnly && (
          <R.Flex
            gap='1'
            style={{
              position: 'absolute',
              top: '0.5rem',
              left: '0.5rem',
              display: over ? 'flex' : 'none',
            }}
          >
            <R.Tooltip content='Remove Image'>
              <R.IconButton
                color='red'
                onClick={() => {
                  if (
                    confirm('Please confirm you want to delete this record.')
                  ) {
                    Transforms.removeNodes(editor, {
                      at: figure ? figure[1] : path,
                    });
                    fetcher.submit(
                      {},
                      {
                        method: 'post',
                        action: `/image/${imageLocation}/remove`,
                      }
                    );
                  }
                }}
              >
                <TrashIcon />
              </R.IconButton>
            </R.Tooltip>
            <UpsertImageButton element={element} />
            <StyleImageDialog />
          </R.Flex>
        )}
      </R.Flex>
    </R.Flex>
  );
}
