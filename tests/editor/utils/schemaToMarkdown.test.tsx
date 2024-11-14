import { describe, expect, it } from 'vitest';
import { parserMarkdown } from '../../../src/MarkdownEditor/editor/parser/parserMarkdown';
import { schemaToMarkdown } from '../../../src/MarkdownEditor/editor/utils/schemaToMarkdown';

describe('schemaToMarkdown', () => {
  it('should correctly convert a basic paragraph to Markdown', () => {
    const input = `{
      "type": "paragraph",
      "children": [{ "text": "This is a paragraph." }]
    }`;

    const { schema } = parserMarkdown(input);
    const markdownOutput = schemaToMarkdown(schema);

    expect(markdownOutput).toMatchSnapshot();
  });

  it('should correctly handle headings of various levels', () => {
    const input = `[
      { "type": "head", "level": 1, "children": [{ "text": "Heading 1" }] },
      { "type": "head", "level": 2, "children": [{ "text": "Heading 2" }] }
    ]`;

    const { schema } = parserMarkdown(input);
    const markdownOutput = schemaToMarkdown(schema);

    expect(markdownOutput).toMatchSnapshot();
  });

  it('should correctly convert lists and list items to Markdown', () => {
    const input = `[
      { "type": "list", "children": [
          { "type": "list-item", "children": [{ "text": "Item 1" }] },
          { "type": "list-item", "children": [{ "text": "Item 2" }] }
        ]
      }
    ]`;

    const { schema } = parserMarkdown(input);
    const markdownOutput = schemaToMarkdown(schema);

    expect(markdownOutput).toMatchSnapshot();
  });

  it('should handle code blocks with different languages', () => {
    const input = `{
      "type": "code",
      "language": "javascript",
      "children": [{ "children": [{ "text": "console.log('Hello, world!');" }] }]
    }`;

    const { schema } = parserMarkdown(input);
    const markdownOutput = schemaToMarkdown(schema);

    expect(markdownOutput).toMatchSnapshot();
  });

  it('should correctly format a table', () => {
    const input = `{
      "type": "table",
      "children": [
        { "type": "table-row", "children": [
            { "type": "table-cell", "children": [{ "text": "Header 1" }] },
            { "type": "table-cell", "children": [{ "text": "Header 2" }] }
          ]
        },
        { "type": "table-row", "children": [
            { "type": "table-cell", "children": [{ "text": "Cell 1" }] },
            { "type": "table-cell", "children": [{ "text": "Cell 2" }] }
          ]
        }
      ]
    }`;

    const { schema } = parserMarkdown(input);
    const markdownOutput = schemaToMarkdown(schema);

    expect(markdownOutput).toMatchSnapshot();
  });

  it('should correctly handle blockquotes', () => {
    const input = `{
      "type": "blockquote",
      "children": [{ "text": "This is a quote." }]
    }`;

    const { schema } = parserMarkdown(input);
    const markdownOutput = schemaToMarkdown(schema);

    expect(markdownOutput).toMatchSnapshot();
  });

  it('should handle links and link-cards correctly', () => {
    const input = `[
      { "type": "link-card", "url": "https://example.com", "name": "Example Site" },
      { "type": "paragraph", "children": [{ "type": "link", "url": "https://example.com", "children": [{ "text": "Example Link" }] }] }
    ]`;

    const { schema } = parserMarkdown(input);
    const markdownOutput = schemaToMarkdown(schema);

    expect(markdownOutput).toMatchSnapshot();
  });

  it('should correctly handle media nodes like images and videos', () => {
    const input = `[
      { "type": "media", "url": "https://example.com/image.jpg", "alt": "Example Image", "height": 200 },
      { "type": "media", "url": "https://example.com/video.mp4", "height": 300 }
    ]`;

    const { schema } = parserMarkdown(input);
    const markdownOutput = schemaToMarkdown(schema);

    expect(markdownOutput).toMatchSnapshot();
  });

  it('should handle horizontal rules and line breaks', () => {
    const input = `[
      { "type": "hr" },
      { "type": "break" }
    ]`;

    const { schema } = parserMarkdown(input);
    const markdownOutput = schemaToMarkdown(schema);

    expect(markdownOutput).toMatchSnapshot();
  });
});
