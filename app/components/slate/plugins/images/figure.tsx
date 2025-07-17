import { Editor, Element } from 'slate';
import {
  ReactEditor,
  useSlateStatic,
  type RenderElementProps,
} from 'slate-react';
import * as R from '@radix-ui/themes';

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
