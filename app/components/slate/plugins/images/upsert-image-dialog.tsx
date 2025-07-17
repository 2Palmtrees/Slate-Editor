import * as R from '@radix-ui/themes';
import { Image } from 'lucide-react';
import { useFetcher } from 'react-router';
import { useSlate } from 'slate-react';
import { insertImage, setImage } from './with-images';
import { useEffect, useRef, useState } from 'react';
import type { ImageElement } from '../../custom-types';
import { isInImage } from './utils';

export default function UpsertImageDialog({
  element,
}: {
  element?: ImageElement;
}) {
  const editor = useSlate();
  const fetcher = useFetcher();
  const ref = useRef<HTMLInputElement>(null);
  const [pickedImage, setPickedImage] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  let data = fetcher.data;
  let errors = fetcher.data?.errors;
  let existingImageId = element?.url.split('/').pop();

  useEffect(() => {
    if (fetcher.data?.imageId) {
      let url = `http://localhost:5173/image/${fetcher.data?.imageId}`;
      if (existingImageId) {
        setImage(editor, url);
        fetcher.submit(
          {},
          { method: 'post', action: `image/${existingImageId}/remove` }
        );
      } else {
        insertImage(editor, url);
      }
      setPickedImage(null);
      setOpen(false);
    }
  }, [data]);

  function handleClick() {
    ref.current?.click();
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.currentTarget.files) {
      setPickedImage(null);
      return;
    }
    setPickedImage(event.currentTarget.files[0]);
  }

  return (
    <R.Dialog.Root open={open} onOpenChange={setOpen}>
      <R.Tooltip content={existingImageId ? 'Change Image' : 'Insert Image'}>
        <R.Dialog.Trigger>
          <R.IconButton
            disabled={isInImage(editor) && !element}
            variant={existingImageId ? 'solid' : 'outline'}
            onClick={() => setOpen(true)}
          >
            <Image width='18' height='18' />
          </R.IconButton>
        </R.Dialog.Trigger>
      </R.Tooltip>

      <R.Dialog.Content maxWidth='450px'>
        <R.Dialog.Title>Image</R.Dialog.Title>
        <R.Dialog.Description size='2' mb='4'>
          Select an image.
        </R.Dialog.Description>

        <R.Box
          onClick={handleClick}
          width='200px'
          height='200px'
          style={{
            backgroundColor: 'var(--gray-2)',
            textAlign: 'center',
            lineHeight: '200px',
            cursor: 'pointer',
          }}
        >
          {pickedImage && (
            <img
              src={URL.createObjectURL(pickedImage)}
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                margin: '0 auto',
              }}
            />
          )}
          {!pickedImage && existingImageId && (
            <img
              src={`http://localhost:5173/image/${existingImageId}-small`}
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                margin: '0 auto',
              }}
            />
          )}
        </R.Box>
        <fetcher.Form
          method='post'
          encType='multipart/form-data'
          action='/image/upload'
        >
          <R.Flex direction='column' gap='3'>
            <input
              ref={ref}
              hidden
              type='file'
              name='image'
              onChange={handleChange}
            />
            <R.Text color='red'>
              {errors?.image ? <R.Em>{errors.image}</R.Em> : null}
            </R.Text>
          </R.Flex>

          <R.Flex gap='3' mt='4' justify='end'>
            <R.Dialog.Close>
              <R.Button
                variant='soft'
                color='gray'
                onClick={() => setPickedImage(null)}
              >
                Cancel
              </R.Button>
            </R.Dialog.Close>
            {/* <Dialog.Close> */}
            <R.Button type='submit'>Submit</R.Button>
            {/* </Dialog.Close> */}
          </R.Flex>
        </fetcher.Form>
      </R.Dialog.Content>
    </R.Dialog.Root>
  );
}
