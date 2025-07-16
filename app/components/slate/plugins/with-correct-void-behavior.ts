import { Editor, Element, Node, Path, Range, Transforms } from 'slate';
import type { CustomEditor } from '../custom-types';

export function withCorrectVoidBehavior(editor: CustomEditor) {
  const { deleteBackward, insertBreak } = editor;

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

  // if prev node is a void node, remove the current node if it's empty and select the void node
  editor.deleteBackward = (unit) => {
    const [figcaption] = Editor.nodes(editor, {
      match: (node) =>
        !Editor.isEditor(node) &&
        Element.isElement(node) &&
        node.type === 'figcaption',
    });
    if (
      !!figcaption &&
      Element.isElement(figcaption[0]) &&
      Editor.isEmpty(editor, figcaption[0])
    ) {
      return;
    }
    
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

    

    deleteBackward(unit);
  };

  return editor;
}
