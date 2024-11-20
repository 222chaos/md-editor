import { createEditor } from 'slate';
import { describe, expect, test, vi } from 'vitest';
import { handlePaste } from '../../src/MarkdownEditor/editor/Editor';
import { EditorStore } from '../../src/MarkdownEditor/editor/store';

describe('handlePaste', () => {
  test('should handle plain text paste', async () => {
    const mockEvent = {
      clipboardData: {
        getData: vi.fn((type) => {
          if (type === 'text/plain') return 'Mocked plain text';
          return '';
        }),
        files: [],
      },
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as React.ClipboardEvent<HTMLDivElement>;

    const editor = createEditor();

    editor.children = [
      {
        type: 'paragraph',
        children: [{ text: 'Initial content' }],
      },
    ];

    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    };

    const store = {
      editor,
    } as unknown as EditorStore;

    await handlePaste(mockEvent, editor, store, {});

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  test('should insert media for URLs starting with "http"', async () => {
    const mockEvent = {
      clipboardData: {
        getData: vi.fn((type) => {
          if (type === 'text/plain') return 'http://example.com/image.jpg';
          return '';
        }),
        files: [],
      },
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as React.ClipboardEvent<HTMLDivElement>;

    const editor = createEditor();
    editor.children = [
      {
        type: 'paragraph',
        children: [{ text: 'Initial content' }],
      },
    ];
    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    };

    const store = {
      editor,
    } as unknown as EditorStore;

    await handlePaste(mockEvent, editor, store, {});

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });
  test('should handle file uploads from clipboard', async () => {
    const mockFile = new File(['mock content'], 'mock.txt', {
      type: 'text/plain',
    });
    const mockEvent = {
      clipboardData: {
        getData: vi.fn(() => ''),
        files: [mockFile],
      },
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as React.ClipboardEvent<HTMLDivElement>;

    const editor = createEditor();
    editor.children = [
      {
        type: 'paragraph',
        children: [{ text: 'Initial content' }],
      },
    ];

    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    };

    const store = { editor } as unknown as EditorStore;

    const mockUpload = vi.fn(() =>
      Promise.resolve(['http://example.com/mock.txt']),
    );
    const editorProps = {
      image: { upload: mockUpload },
    };

    await handlePaste(mockEvent, editor, store, editorProps);

    expect(mockUpload).toHaveBeenCalledWith([mockFile]);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  test('should handle code blocks', async () => {
    const mockEvent = {
      clipboardData: {
        getData: vi.fn((type) => {
          if (type === 'text/plain') return 'line1\nline2';
          return '';
        }),
        files: [],
      },
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as React.ClipboardEvent<HTMLDivElement>;

    const editor = createEditor();
    editor.children = [{ type: 'code', children: [{ text: '' }] }];
    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    };

    const store = {
      editor,
    } as unknown as EditorStore;

    await handlePaste(mockEvent, editor, store, {});
  });
});
