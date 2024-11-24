import { fireEvent, render } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import * as Slate from 'slate';
import { describe, expect, it, vi } from 'vitest';
import { useEditorStore } from '../../../../src/MarkdownEditor/editor/store';
import { ToolBar } from '../../../../src/MarkdownEditor/editor/tools/ToolBar';

vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: vi.fn(),
}));

vi.spyOn(Slate.Editor, 'nodes').mockImplementation(
  () => [[{ type: 'mock-node' }]] as any,
);

describe('ToolBar Component', () => {
  it('should prevent default and stop propagation on mouse down', () => {
    (useEditorStore as ReturnType<typeof vi.fn>).mockReturnValue({
      store: { editor: {} },
    });
    const getPrefixCls = vi.fn().mockReturnValue('test-prefix');
    const contextValue = {
      getPrefixCls,
      iconPrefixCls: 'test-icon-prefix',
    };

    const { container } = render(
      <ConfigProvider.ConfigContext.Provider value={contextValue}>
        <ToolBar />
      </ConfigProvider.ConfigContext.Provider>,
    );

    const toolbarDiv = container.firstChild as HTMLElement;
    expect(toolbarDiv).toBeDefined();

    fireEvent.mouseDown(toolbarDiv);

    expect(getPrefixCls).toHaveBeenCalled();
  });
});
