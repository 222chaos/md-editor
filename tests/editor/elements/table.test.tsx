import { fireEvent, render, screen } from '@testing-library/react';
import { createEditor } from 'slate';
import { RenderElementProps, Slate, withReact } from 'slate-react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Table,
  TableCell,
} from '../../../src/MarkdownEditor/editor/elements/table';
import { parserMarkdown } from '../../../src/MarkdownEditor/editor/parser/parserMarkdown';
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

  const markdownTable = `
| 业务          | 2021Q1  | 2021Q2  | 2021Q3  | 2021Q4  | 2022Q1  | 2022Q2  | 2022Q3  | 2022Q4  | 2023Q1  | 2023Q2  | 2023Q3  | 2023Q4  |
| ------------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- |
| 收入          | 135,303 | 138,259 | 142,368 | 144,188 | 135,471 | 134,034 | 140,093 | 144,954 | 149,986 | 149,208 | 154,625 | 155,200 |
| 增值服务      | 72,443  | 72,013  | 75,203  | 71,913  | 72,738  | 71,683  | 72,727  | 70,417  | 79,337  | 74,211  | 75,748  | 69,100  |
| 网络游戏     | 43,600  | 43,000  | 44,900  | 42,800  | 43,600  | 42,500  | na      | na      | na      | 44,500  | 46,000  | 40,900  |
| 社交网络收入 | 28,800  | 29,000  | 30,300  | 29,100  | 29,100  | 29,200  | na      | na      | na      | 29,700  | 29,700  | 28,200  |
| 网络广告      | 21,820  | 22,833  | 22,495  | 21,518  | 17,988  | 18,638  | 21,443  | 24,660  | 20,964  | 25,003  | 25,721  | 29,794  |
| 其他          | 41,040  | 43,413  | 44,670  | 50,757  | 44,745  | 43,713  | 45,923  | 49,877  | 49,685  | 49,994  | 53,156  | 54,379  |
| 金融科技     | 39,028  | 41,892  | 43,317  | 47,958  | 42,768  | 42,208  | 44,844  | 47,244  | 48,701  | 48,635  | 52,048  | 52,435  |
| 云           | 62,012   | 1,521   | 1,353   | 2,799   | 1,977   | 1,505   | 1,079   | 2,633   | 984     | 1,359   | 1,108   | 1,944   |
  `;

  // 使用 parserMarkdown 解析 Markdown 表格，并返回 Slate 结构的 schema
  const { schema } = parserMarkdown(markdownTable);

  beforeEach(() => {
    storeMock = {
      floatBarOpen: false,
      openTableMenus: vi.fn(),
      editor: {
        hasPath: vi.fn(() => true),
        children: schema, // 使用解析得到的 schema 作为 Slate 数据结构
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

  it('renders Table component correctly from Markdown', () => {
    const editor = withReact(createEditor());

    const { asFragment } = render(
      <Slate editor={editor} initialValue={storeMock.editor.children}>
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
      <Slate editor={editor} initialValue={storeMock.editor.children}>
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
      <Slate editor={editor} initialValue={storeMock.editor.children}>
        <TableCell {...props} />
      </Slate>,
    );

    const tableHeader = screen.getByRole('columnheader');
    fireEvent.contextMenu(tableHeader);

    expect(storeMock.openTableMenus).toHaveBeenCalledTimes(1);
  });
});
