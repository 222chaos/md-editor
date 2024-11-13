import { fireEvent, render, screen } from '@testing-library/react';
import { createEditor } from 'slate';
import { RenderElementProps, Slate, withReact } from 'slate-react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Table,
  TableCell,
} from '../../../src/MarkdownEditor/editor/elements/table';
import { useEditorStore } from '../../../src/MarkdownEditor/editor/store';
type Mock = ReturnType<typeof vi.fn>;

class IntersectionObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
global.IntersectionObserver = IntersectionObserverMock as any;

vi.mock('../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: vi.fn(),
}));

describe('Table component', () => {
  let storeMock: any;
  let props: RenderElementProps;
  const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ];

  beforeEach(() => {
    storeMock = {
      floatBarOpen: false,
      openTableMenus: vi.fn(),
      editor: {
        hasPath: vi.fn(() => true),
        children: initialValue,
      },
      dragStart: vi.fn(),
      tableCellNode: [{ align: 'center' }, [0, 0]],
    };

    (useEditorStore as Mock).mockReturnValue({ store: storeMock });

    props = {
      attributes: {
        'data-slate-node': 'element',
        ref: undefined,
      },
      children: <span>Test Content</span>,
      element: { title: true, align: 'center' },
    };
  });

  it('renders Table component correctly', () => {
    const editor = withReact(createEditor());

    const { asFragment } = render(
      <Slate editor={editor} initialValue={initialValue}>
        <Table {...props} />
      </Slate>,
    );

    const tableContainer = screen.getByRole('table');
    expect(tableContainer).toBeInTheDocument();
    expect(tableContainer).toHaveStyle({
      borderCollapse: 'collapse',
      borderSpacing: '0',
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders TableCell component correctly as <th> when title is present', () => {
    const editor = withReact(createEditor());

    const { asFragment } = render(
      <Slate editor={editor} initialValue={initialValue}>
        <TableCell {...props} />
      </Slate>,
    );

    const tableHeader = screen.getByRole('columnheader');
    expect(tableHeader).toBeInTheDocument();
    expect(tableHeader).toHaveStyle({ textAlign: 'center' });

    expect(asFragment()).toMatchSnapshot();
  });

  it('calls context menu handler on TableCell right-click', () => {
    const editor = withReact(createEditor());

    render(
      <Slate editor={editor} initialValue={initialValue}>
        <TableCell {...props} />
      </Slate>,
    );

    const tableHeader = screen.getByRole('columnheader');
    fireEvent.contextMenu(tableHeader);

    expect(storeMock.openTableMenus).toHaveBeenCalledTimes(1);
  });
});
