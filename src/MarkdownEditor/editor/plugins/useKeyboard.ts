import isHotkey from 'is-hotkey';
import { runInAction } from 'mobx';
import React, { useMemo } from 'react';
import { Editor, Element, Node, Path, Range, Transforms } from 'slate';
import { EditorStore } from '../store';
import { EditorUtils } from '../utils/editorUtils';
import { keyArrow } from './hotKeyCommands/arrow';
import { BackspaceKey } from './hotKeyCommands/backspace';
import { EnterKey } from './hotKeyCommands/enter';
import { MatchKey } from './hotKeyCommands/match';
import { TabKey } from './hotKeyCommands/tab';

export const useKeyboard = (store: EditorStore) => {
  return useMemo(() => {
    const tab = new TabKey(store?.editor);
    const backspace = new BackspaceKey(store?.editor);
    const enter = new EnterKey(store, backspace);
    const match = new MatchKey(store?.editor);
    return (e: React.KeyboardEvent) => {
      if (
        store.openInsertCompletion &&
        (isHotkey('up', e) || isHotkey('down', e))
      ) {
        e.preventDefault();
        return;
      }
      if (isHotkey('mod+z', e) || isHotkey('mod+shift+z', e)) {
        store.doManual();
      }
      if (isHotkey('mod+ArrowDown', e)) {
        e.preventDefault();
        Transforms.select(store?.editor, Editor.end(store?.editor, []));
      }
      if (isHotkey('mod+ArrowUp', e)) {
        e.preventDefault();
        Transforms.select(store?.editor, Editor.start(store?.editor, []));
      }
      if (isHotkey('backspace', e) && store?.editor.selection) {
        if (Range.isCollapsed(store?.editor.selection)) {
          if (backspace.run()) {
            e.stopPropagation();
            e.preventDefault();
          }
        } else {
          if (backspace.range()) e.preventDefault();
        }
      }
      if (isHotkey('mod+shift+v', e)) {
        e.preventDefault();
      }
      if (isHotkey('mod+alt+v', e) || isHotkey('mod+opt+v', e)) {
        e.preventDefault();
      }
      match.run(e);

      if (e.key.toLowerCase().startsWith('arrow')) {
        if (['ArrowUp', 'ArrowDown'].includes(e.key)) return;
        keyArrow(store, e);
      } else {
        if (e.key === 'Tab') tab.run(e);
        if (e.key === 'Enter') {
          enter.run(e);
        }
        const [node] = Editor.nodes<any>(store?.editor, {
          match: (n) => Element.isElement(n),
          mode: 'lowest',
        });
        if (!node) return;
        let str = Node.string(node[0]) || '';
        if (node[0].type === 'paragraph') {
          if (e.key === 'Enter' && /^<[a-z]+[\s"'=:;()\w\-[\]]*>/.test(str)) {
            Transforms.delete(store?.editor, { at: node[1] });
            Transforms.insertNodes(
              store?.editor,
              {
                type: 'code',
                language: 'html',
                render: true,
                children: str.split('\n').map((s) => {
                  return { type: 'code-line', children: [{ text: s }] };
                }),
              },
              { select: true, at: node[1] },
            );
            e.preventDefault();
            return;
          }
          setTimeout(() => {
            const [node] = Editor.nodes<any>(store?.editor, {
              match: (n) => Element.isElement(n) && n.type === 'paragraph',
              mode: 'lowest',
            });
            if (
              node &&
              node[0].children.length === 1 &&
              !EditorUtils.isDirtLeaf(node[0].children[0]) &&
              (e.key === 'Backspace' || /^[^\n]$/.test(e.key))
            ) {
              let str = Node.string(node[0]) || '';
              const codeMatch = str.match(/^```([\w+\-#]+)$/i);
              if (codeMatch) {
              } else {
                const insertMatch = str.match(/^\/([^\n]+)?$/i);
                if (
                  insertMatch &&
                  !(
                    !Path.hasPrevious(node[1]) &&
                    Node.parent(store?.editor, node[1]).type === 'list-item'
                  )
                ) {
                  runInAction(() => (store.openInsertCompletion = true));
                  setTimeout(() => {
                    store.insertCompletionText$.next(insertMatch[1]);
                  });
                }
              }
            }
          });
        }
      }
    };
  }, [store?.editor]);
};
