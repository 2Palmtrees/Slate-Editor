import { useSlate } from 'slate-react';
import { Pencil1Icon } from '@radix-ui/react-icons';
import {
  Button,
  Checkbox,
  Dialog,
  Flex,
  IconButton,
  Text,
  Tooltip,
} from '@radix-ui/themes';
import {
  isImageBlockActive,
  isImageStyleType,
  toggleImageBlock,
  type CustomImageElementFormat,
} from './utils';

export default function StyleImageDialog() {
  return (
    <Dialog.Root>
      <Tooltip content='Format Image'>
        <Dialog.Trigger>
          <IconButton variant='solid'>
            <Pencil1Icon />
          </IconButton>
        </Dialog.Trigger>
      </Tooltip>

      <Dialog.Content maxWidth='450px'>
        <Dialog.Title>Image</Dialog.Title>
        <Dialog.Description size='2' mb='4'>
          Format image.
        </Dialog.Description>

        <Flex gap='2'>
          <label>
            <Text as='div' size='2' mb='1' weight='bold'>
              Style
            </Text>
            <Flex direction='column'>
              <FormatCheckbox format='stretch' label='Stretch' />
              <FormatCheckbox format='float-left' label='Float Left' />
              <FormatCheckbox format='float-right' label='Float Right' />
              <FormatCheckbox format='figure' label='Caption' />
            </Flex>
          </label>
          <label>
            <Text as='div' size='2' mb='1' weight='bold'>
              Align
            </Text>
            <Flex direction='column'>
              <FormatCheckbox format='align-left' label='Left' />
              <FormatCheckbox format='align-center' label='Center' />
              <FormatCheckbox format='align-right' label='Right' />
            </Flex>
          </label>
        </Flex>

        <Flex gap='3' mt='4' justify='end'>
          <Dialog.Close>
            <Button>Close</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function FormatCheckbox({
  format,
  label,
}: {
  format: CustomImageElementFormat;
  label: string;
}) {
  const editor = useSlate();
  const isActive = isImageBlockActive(
    editor,
    format,
    isImageStyleType(format) ? 'style' : 'type'
  );
  const stretchIsActive = isImageBlockActive(editor, 'stretch', 'style');

  // console.log(stretchIsActive);

  return (
    <Text as='label' size='2'>
      <Flex gap='2'>
        <Checkbox
          disabled={
            stretchIsActive && format !== 'stretch' && format !== 'figure'
          }
          checked={isActive}
          onCheckedChange={() => {
            toggleImageBlock(editor, format);
          }}
        />
        {label}
      </Flex>
    </Text>
  );
}
