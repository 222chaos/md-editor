import { describe, expect, it } from 'vitest';
import { parserMarkdown } from '../../../src/MarkdownEditor/editor/parser/parserMarkdown';
import { schemaToMarkdown } from '../../../src/MarkdownEditor/editor/utils/schemaToMarkdown';

describe('schemaToMarkdown', () => {
  it('should correctly convert schema nodes for a single Markdown input', () => {
    const input = `
    `;

    let md = '';
    const chunkSize = 1;
    let markdownOutput = '';
    let buffer = '';

    for (let i = 0; i < input.length; i += chunkSize) {
      const chunk = input.slice(i, i + chunkSize);
      buffer += chunk;

      const openBrackets = (buffer.match(/{/g) || []).length;
      const closeBrackets = (buffer.match(/}/g) || []).length;
      const openSquareBrackets = (buffer.match(/\[/g) || []).length;
      const closeSquareBrackets = (buffer.match(/]/g) || []).length;

      if (
        openBrackets === closeBrackets &&
        openSquareBrackets === closeSquareBrackets
      ) {
        md += buffer;
        buffer = '';

        const { schema } = parserMarkdown(md);
        markdownOutput = schemaToMarkdown(schema);
      }
    }

    expect(markdownOutput).toMatchSnapshot();
  });
});
