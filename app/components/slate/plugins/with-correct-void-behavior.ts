import { Editor, Element, Node, Path, Range, Transforms } from 'slate';
import type { CustomEditor } from '../custom-types';

export function withCorrectVoidBehavior(editor: CustomEditor) {
  const { deleteForward, deleteBackward, insertBreak, insertNode } = editor;

  // if current selection is void node, insert a default node below
  editor.insertBreak = () => {
    if (!editor.selection || !Range.isCollapsed(editor.selection)) {
      return insertBreak();
    }

    const selectedNodePath = Path.parent(editor.selection.anchor.path);
    const selectedNode = Node.get(editor, selectedNodePath);
    if (Editor.isVoid(editor, selectedNode)) {
      Editor.insertNode(editor, {
        type: 'paragraph',
        children: [{ text: '' }],
      });
      return;
    }

    insertBreak();
  };

  editor.deleteForward = (unit) => {
    if (
      !editor.selection ||
      !Range.isCollapsed(editor.selection) ||
      editor.selection.anchor.offset !== 0
    ) {
      return deleteForward(unit);
    }

    // // prevent deleting the image
    const parentPath = Path.parent(editor.selection.anchor.path);
    const nextNodePath = Path.next(parentPath);
    const nextNode = Node.get(editor, nextNodePath);

    if (nextNode.type === 'image' || nextNode.type === 'figure') {
      console.log('nextnode', nextNode.type);
      return;
    }

    deleteForward(unit);
  };

  editor.deleteBackward = (unit) => {
    // if prev node is a void node, remove the current node if it's empty and select the void node
    if (
      !editor.selection ||
      !Range.isCollapsed(editor.selection) ||
      editor.selection.anchor.offset !== 0
    ) {
      return deleteBackward(unit);
    }

    const parentPath = Path.parent(editor.selection.anchor.path);

    if (Path.hasPrevious(parentPath)) {
      const prevNodePath = Path.previous(parentPath);
      const prevNode = Node.get(editor, prevNodePath);
      if (prevNode.type === 'image' || prevNode.type === 'figure') {
        console.log('prevNode', prevNode.type);
        return;
      }
      if (Editor.isVoid(editor, prevNode)) {
        const parentNode = Node.get(editor, parentPath);
        const parentIsEmpty = Node.string(parentNode).length === 0;

        if (parentIsEmpty) {
          return Transforms.removeNodes(editor);
        } else {
          return Transforms.select(editor, prevNodePath);
        }
      }
    }

    // prevent deleting the image
    const [image] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === 'image',
    });
    if (!!image) {
      console.log('selected an image, can not delete!');
      return;
    }

    deleteBackward(unit);
  };

  return editor;
}
