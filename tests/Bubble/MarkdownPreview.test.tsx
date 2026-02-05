import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MarkdownPreview } from '../../src/Bubble/MessagesContent/MarkdownPreview';

vi.mock('antd', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd')>();
  return {
    ...actual,
    Popover: ({ children, content }: any) =>
      content !== null && content !== undefined && content !== false ? (
        <div data-testid="markdown-preview-popover-wrapper">
          {content}
          {children}
        </div>
      ) : (
        children
      ),
    theme: {
      ...(actual as any).theme,
      useToken: () => ({
        token: { colorError: '#ff4d4f', colorErrorBorder: '#ffccc7' },
      }),
    },
  };
});

vi.mock('react-error-boundary', () => ({
  ErrorBoundary: ({ children, fallback }: any) => (
    <div data-testid="error-boundary">
      {children}
      {fallback}
    </div>
  ),
}));

vi.mock('../../src', () => ({
  MarkdownEditor: () => <div data-testid="markdown-editor">Editor</div>,
  parserMdToSchema: () => ({ schema: {} }),
}));

vi.mock('../../src/Bubble/BubbleConfigProvide', () => ({
  BubbleConfigContext: React.createContext({
    locale: {},
    standalone: false,
  }),
}));

vi.mock('../../src/Bubble/MessagesContent/BubbleContext', () => ({
  MessagesContext: React.createContext({ hidePadding: false }),
}));

describe('MarkdownPreview', () => {
  const defaultProps = {
    content: 'hello',
    beforeContent: null,
    afterContent: null,
  };

  describe('placement right 且 extra 为空时不使用 Popover', () => {
    it('当 placement 为 right 且 extra 为 null 时，不渲染 Popover，避免 hover 出现空浮层小点', () => {
      render(
        <MarkdownPreview
          {...defaultProps}
          placement="right"
          extra={null}
        />,
      );

      expect(
        screen.queryByTestId('markdown-preview-popover-wrapper'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    });

    it('当 placement 为 right 且 extra 为 undefined 时，不渲染 Popover', () => {
      render(
        <MarkdownPreview
          {...defaultProps}
          placement="right"
          extra={undefined}
        />,
      );

      expect(
        screen.queryByTestId('markdown-preview-popover-wrapper'),
      ).not.toBeInTheDocument();
    });

    it('当 placement 为 right 且 extra 有内容时，使用 Popover 包裹', () => {
      render(
        <MarkdownPreview
          {...defaultProps}
          placement="right"
          extra={<span data-testid="extra-content">Extra</span>}
        />,
      );

      expect(
        screen.getByTestId('markdown-preview-popover-wrapper'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('extra-content')).toHaveTextContent('Extra');
    });
  });

  describe('placement left', () => {
    it('当 placement 为 left 时，extra 直接作为兄弟节点渲染，不使用 Popover', () => {
      render(
        <MarkdownPreview
          {...defaultProps}
          placement="left"
          extra={<span data-testid="extra-left">Extra Left</span>}
        />,
      );

      expect(
        screen.queryByTestId('markdown-preview-popover-wrapper'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('extra-left')).toHaveTextContent('Extra Left');
    });

    it('当 placement 为 left 且 extra 为 null 时，正常渲染内容', () => {
      render(
        <MarkdownPreview
          {...defaultProps}
          placement="left"
          extra={null}
        />,
      );

      expect(
        screen.queryByTestId('markdown-preview-popover-wrapper'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    });
  });
});
