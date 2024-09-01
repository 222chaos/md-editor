﻿import { observer } from 'mobx-react-lite';
import React from 'react';
import { Node } from 'slate';
import { ElementProps, FootnoteDefinitionNode } from '../../el';
import { useSelStatus } from '../../hooks/editor';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';

export const FootnoteDefinition = observer(
  (props: ElementProps<FootnoteDefinitionNode>) => {
    const store = useEditorStore();
    const [selected] = useSelStatus(props.element);
    const element = props.element;
    return React.useMemo(() => {
      const str = Node.string(props.element);

      return (
        <>
          {element.identifier === '1' ? (
            <div
              style={{
                borderBottom: '1px solid #e8e8e8',
                padding: '4px 0',
                margin: '12px 0',
                fontSize: 14,
              }}
              contentEditable={false}
            >
              脚注
            </div>
          ) : null}
          <div
            {...props.attributes}
            style={{
              fontSize: '12px',
              margin: '5px 0',
            }}
            contentEditable={false}
            data-be={'footnoteDefinition'}
            className={!str ? 'drag-el empty' : 'drag-el'}
            onDragStart={store.dragStart}
            data-empty={!str && selected ? 'true' : undefined}
          >
            <DragHandle />
            {element.identifier}.
            <a
              href={'#md-editor-ref' + element.identifier}
              style={{
                color: '#1890FF',
                textDecoration: 'none',
                marginLeft: '5px',
                cursor: 'pointer',
              }}
            >
              {props.children.at(1)}
            </a>
          </div>
        </>
      );
    }, [props.element.children, store.refreshHighlight, selected]);
  },
);