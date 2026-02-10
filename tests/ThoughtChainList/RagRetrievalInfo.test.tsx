/**
 * RagRetrievalInfo 组件测试用例
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { I18nContext } from '../../src/I18n';
import { RagRetrievalInfo } from '../../src/ThoughtChainList/RagRetrievalInfo';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <I18nContext.Provider value={{ locale: {} as any, language: 'zh-CN' }}>
    {children}
  </I18nContext.Provider>
);

describe('RagRetrievalInfo', () => {
  it('应渲染检索查询和结果', () => {
    render(
      <TestWrapper>
        <RagRetrievalInfo
          category="RagRetrieval"
          onMetaClick={vi.fn()}
          input={{ searchQueries: ['关键词'] }}
          output={{
            chunks: [
              {
                docMeta: {
                  doc_name: '文档1',
                  doc_id: '1',
                  type: 'doc',
                  origin_text: '内容',
                  answer: '答案1',
                },
                content: '',
                originUrl: '',
              },
            ],
          }}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('关键词')).toBeInTheDocument();
    expect(screen.getByText('文档1')).toBeInTheDocument();
  });

  it('点击检索结果块时应调用 onMetaClick 并传入 docMeta', () => {
    const onMetaClick = vi.fn();

    render(
      <TestWrapper>
        <RagRetrievalInfo
          category="RagRetrieval"
          onMetaClick={onMetaClick}
          input={{ searchQueries: ['q'] }}
          output={{
            chunks: [
              {
                docMeta: {
                  doc_name: 'DocA',
                  doc_id: 'id-a',
                  type: 'doc',
                  origin_text: 'text',
                  answer: 'Answer A',
                },
                content: '',
                originUrl: '',
              },
            ],
          }}
        />
      </TestWrapper>,
    );

    const chunkBlock = screen.getByText('DocA');
    fireEvent.click(chunkBlock);

    expect(onMetaClick).toHaveBeenCalledTimes(1);
    expect(onMetaClick).toHaveBeenCalledWith(
      expect.objectContaining({
        doc_name: 'DocA',
        doc_id: 'id-a',
        type: 'doc',
        origin_text: 'text',
        answer: 'Answer A',
      }),
    );
  });
});
