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
  const imageId = element.url.split('/').pop();

  const [over, setOver] = useState(false);
  const fetcher = useFetcher();

  // console.log(element, 'does is have a figure?', figure);

  return (
    <R.Flex
      {...attributes}
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
      contentEditable={false}
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
          src={element.url}
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
                      { method: 'post', action: `image/${imageId}/remove` }
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

export function Figure({ props }: { props: RenderElementProps }) {
  const { attributes, children, element } = props;

  if (element.type !== 'figure') {
    throw new Error('Element "Figure" must be of type "image"');
  }
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);
  const [image] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isAncestor(n) && n.type === 'image',
    at: path,
  });
  let imageStyle = image && image[0].style;

  // console.log('image', image);

  return (
    <R.Flex
      {...attributes}
      my='2'
      mr={imageStyle === 'float-left' ? '2' : '0'}
      ml={imageStyle === 'float-right' ? '2' : '0'}
      justify={
        imageStyle === 'align-center'
          ? 'center'
          : imageStyle === 'align-right'
          ? 'end'
          : 'start'
      }
      width={{
        initial: '100%',
        sm:
          imageStyle === 'stretch' ||
          imageStyle === 'align-left' ||
          imageStyle === 'align-center' ||
          imageStyle === 'align-right' ||
          imageStyle === undefined
            ? '100%'
            : '50%',
      }}
      style={{
        float:
          imageStyle === 'float-left'
            ? 'left'
            : imageStyle === 'float-right'
            ? 'right'
            : 'none',
      }}
    >
      <R.Flex
        asChild
        direction='column'
        gap='2'
        width={{
          initial: '100%',
          sm:
            imageStyle === 'stretch' ||
            imageStyle === 'float-right' ||
            imageStyle === 'float-left'
              ? '100%'
              : '50%',
        }}
      >
        <figure>{children}</figure>
      </R.Flex>
    </R.Flex>
  );
}
