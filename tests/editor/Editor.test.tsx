import { fireEvent, render } from '@testing-library/react';
import { observable } from 'mobx';
import { describe, expect, it, vi } from 'vitest';
import { MEditor } from '../../src/MarkdownEditor/editor/Editor';
import { EditorStore } from '../../src/MarkdownEditor/editor/store';

const mockNote = {
  cid: '12345678',
  sort: 1,
};

const mockStore = new EditorStore();

vi.mock('../../src/MarkdownEditor/editor/store', async (importOriginal) => {
  const actual = await importOriginal();
  return Object.assign({}, actual, {
    useEditorStore: () => ({ store: mockStore }),
  });
});

const mockInstance = observable({
  get current() {
    return mockNote;
  },
  index: 0,
  id: 'test-id',
  editorProps: {},
  store: mockStore,
  children: [],
});

class ClipboardEventPolyfill extends Event {
  clipboardData: DataTransfer | null;

  constructor(
    type: string,
    options: { clipboardData?: DataTransfer | null } = {},
  ) {
    super(type, {});
    this.clipboardData = options.clipboardData || null;
  }
}
class DataTransferMock {
  private data: { [key: string]: string } = {};

  setData(type: string, value: string) {
    this.data[type] = value;
  }

  getData(type: string): string {
    return this.data[type] || '';
  }
}

global.ClipboardEvent = ClipboardEventPolyfill as any;
global.DataTransfer = DataTransferMock as any;

describe('MEditor - onPaste功能测试', () => {
  it('should handle plain text paste', async () => {
    const { container, getByRole } = render(
      <MEditor note={mockNote} instance={mockInstance} />,
    );

    const editorDiv = getByRole('textbox');

    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    });
    pasteEvent.clipboardData?.setData('text/plain', '这是一个普通文本');

    fireEvent(editorDiv, pasteEvent);

    expect(container).toMatchSnapshot();
  });

  it('should handle Markdown content', async () => {
    const { container, getByRole } = render(
      <MEditor note={mockNote} instance={mockInstance} />,
    );

    const editorDiv = getByRole('textbox');

    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    });
    pasteEvent.clipboardData?.setData('text/plain', '# 这是Markdown标题');

    fireEvent(editorDiv, pasteEvent);

    expect(container).toMatchSnapshot();
  });

  it('should handle media URL paste', async () => {
    const { container, getByRole } = render(
      <MEditor note={mockNote} instance={mockInstance} />,
    );

    const editorDiv = getByRole('textbox');

    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    });
    pasteEvent.clipboardData?.setData(
      'text/plain',
      'media://example?url=http://example.com/image.jpg',
    );

    fireEvent(editorDiv, pasteEvent);

    expect(container).toMatchSnapshot();
  });

  it('should handle attachment URL paste', async () => {
    const { container, getByRole } = render(
      <MEditor note={mockNote} instance={mockInstance} />,
    );

    const editorDiv = getByRole('textbox');

    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    });
    pasteEvent.clipboardData?.setData(
      'text/plain',
      'attach://example?url=http://example.com/file.pdf',
    );

    fireEvent(editorDiv, pasteEvent);

    expect(container).toMatchSnapshot();
  });

  it('should handle HTML paste', async () => {
    const { container, getByRole } = render(
      <MEditor note={mockNote} instance={mockInstance} />,
    );

    const editorDiv = getByRole('textbox');

    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    });
    pasteEvent.clipboardData?.setData('text/html', '<p>这是一个HTML内容</p>');

    fireEvent(editorDiv, pasteEvent);

    expect(container).toMatchSnapshot();
  });
});
