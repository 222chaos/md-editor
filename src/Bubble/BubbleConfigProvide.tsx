import React from 'react';
import type { LocalKeys } from '../I18n';
import { ThoughtChainListProps } from '../ThoughtChainList/types';
import { BubbleProps } from './type';

export type ChatConfigType = {
  agentId?: string;
  sessionId?: string;
  standalone: boolean;
  clientIdRef?: React.MutableRefObject<string>;
  thoughtChain?: {
    enable?: boolean;
    alwaysRender?: boolean;
    render?: (
      bubble: BubbleProps<Record<string, any>>,
      taskList: string,
    ) => React.ReactNode;
  } & ThoughtChainListProps;
  tracert?: {
    /**
     * 是否开启
     */
    enable: boolean;
  };
  /** 可选覆盖，与 I18nContext 合并时优先生效，国际化主数据源为 I18nContext */
  locale?: Partial<LocalKeys>;
  bubble?: BubbleProps<{
    /**
     * 聊天内容
     */
    content: string;
    /**
     * 聊天项的唯一标识
     */
    uuid: number;
  }>;
  compact?: boolean;
};

export const BubbleConfigContext = React.createContext<
  ChatConfigType | undefined
>({
  standalone: false,
  locale: undefined,
});
