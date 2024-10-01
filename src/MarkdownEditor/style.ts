﻿import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from './editor/utils/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      boxSizing: 'border-box',
      height: 'max-content',
      maxWidth: '100%',
      outline: 'none',
      tabSize: 4,
      position: 'relative',
      lineHeight: 1.5,
      whiteSpace: 'normal',
      '> *': {
        boxSizing: 'border-box',
      },
      '&-edit-area': {
        outline: 'none !important',
      },
    },
  };
};

/**
 * AgentChat
 * @param prefixCls
 * @returns
 */
export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('MarkdownEditor', (token) => {
    const editorToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genStyle(editorToken), resetComponent(editorToken)];
  });
}