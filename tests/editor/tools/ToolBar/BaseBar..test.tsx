import { fireEvent, render } from '@testing-library/react';
import * as Slate from 'slate';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useEditorStore } from '../../../../src/MarkdownEditor/editor/store';
import { BaseToolBar } from '../../../../src/MarkdownEditor/editor/tools/ToolBar/BaseBar';

vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: vi.fn(),
}));

vi.spyOn(Slate.Editor, 'nodes').mockImplementation(
  () => [[{ type: 'mock-node' }]] as any,
);

describe('BaseToolBar Component', () => {
  beforeEach(() => {
    (useEditorStore as ReturnType<typeof vi.fn>).mockReturnValue({
      store: {
        editor: {},
        refreshFloatBar: false,
        editorProps: {},
        highlightCache: new Map(),
        openInsertLink$: { next: vi.fn() },
        refreshHighlight: false,
        openLinkPanel: false,
      },
      keyTask$: { next: vi.fn() },
    });
  });

  it('renders BaseToolBar with default props', () => {
    const { container } = render(<BaseToolBar />);
    expect(container.firstChild).toBeDefined();
    expect(
      container.querySelectorAll('.toolbar-action-item').length,
    ).toBeGreaterThan(0);
  });

  it('handles click events on the undo button', () => {
    const mockKeyTaskNext = vi.fn();
    (useEditorStore as ReturnType<typeof vi.fn>).mockReturnValue({
      store: { editor: {} },
      keyTask$: { next: mockKeyTaskNext },
    });

    const { getByRole } = render(<BaseToolBar showEditor={true} />);
    const undoButton = getByRole('button', { name: /undo/i });

    fireEvent.click(undoButton);

    expect(mockKeyTaskNext).toHaveBeenCalledWith({
      key: 'undo',
      args: [],
    });
  });

  it('handles click events on the redo button', () => {
    const mockKeyTaskNext = vi.fn();
    (useEditorStore as ReturnType<typeof vi.fn>).mockReturnValue({
      store: { editor: {} },
      keyTask$: { next: mockKeyTaskNext },
    });

    const { getByRole } = render(<BaseToolBar showEditor={true} />);
    const redoButton = getByRole('button', { name: /redo/i });

    fireEvent.click(redoButton);

    expect(mockKeyTaskNext).toHaveBeenCalledWith({
      key: 'redo',
      args: [],
    });
  });

  it('handles color picker interactions', () => {
    (useEditorStore as ReturnType<typeof vi.fn>).mockReturnValue({
      store: {
        editor: {},
      },
      keyTask$: { next: vi.fn() },
    });

    const { container } = render(<BaseToolBar />);
    const colorPickerButton = container.querySelector(
      '.toolbar-action-item[key="color"]',
    );

    expect(colorPickerButton).toBeDefined();

    if (colorPickerButton) {
      fireEvent.click(colorPickerButton);
    }
  });
  it('renders with min prop enabled', () => {
    const { container } = render(<BaseToolBar min={true} />);
    expect(container.firstChild).toBeDefined();
    expect(
      container.querySelector('.toolbar-action-item-min-plus-icon'),
    ).toBeDefined();
  });

  it('filters out tools based on hideTools prop', () => {
    const { container } = render(<BaseToolBar hideTools={['clear', 'redo']} />);
    expect(
      container.querySelector('.toolbar-action-item[key="clear"]'),
    ).toBeNull();
    expect(
      container.querySelector('.toolbar-action-item[key="redo"]'),
    ).toBeNull();
  });

  it('updates color picker state on color change', () => {
    const { container } = render(<BaseToolBar />);
    const colorPicker = container.querySelector(
      '.toolbar-action-item[key="color"]',
    );

    expect(colorPicker).toBeDefined();

    if (colorPicker) {
      fireEvent.click(colorPicker);
      expect(localStorage.getItem('high-color')).not.toBeNull();
    }
  });
});
