import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { parserMarkdown } from '../../../src/MarkdownEditor/editor/parser/parserMarkdown';
import { schemaToMarkdown } from '../../../src/MarkdownEditor/editor/utils/schemaToMarkdown';
describe('schemaToMarkdown', () => {
  it('should correctly convert schema nodes for a single Markdown input', () => {
    const input = `
## 图片

![](https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*9F0qRYV8EjUAAAAAAAAAAAAADml6AQ/original)

## 视频

![video:视频名](https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/A*NudQQry0ERwAAAAAAAAAAAAADtN3AQ)

    `;

    // let md = '';
    // const chunkSize = 200;
    // let buffer = '';

    // for (let i = 0; i < input.length; i += chunkSize) {
    //   const chunk = input.slice(i, i + chunkSize);
    //   buffer += chunk;

    //   const openBrackets = (buffer.match(/{/g) || []).length;
    //   const closeBrackets = (buffer.match(/}/g) || []).length;
    //   const openSquareBrackets = (buffer.match(/\[/g) || []).length;
    //   const closeSquareBrackets = (buffer.match(/]/g) || []).length;

    //   if (
    //     openBrackets === closeBrackets &&
    //     openSquareBrackets === closeSquareBrackets
    //   ) {
    //     md += buffer;
    //     buffer = '';
    //   }
    // }
    // const schema = parserMarkdown(md).schema;
    const schema = parserMarkdown(input).schema;
    console.log('parserMarkdown(input).schema   ====', schema);

    fs.writeFileSync('schema.json', JSON.stringify(schema, null, 2), 'utf-8');
    const schemaFilePath = path.resolve(__dirname, './schema.json');

    const expectedSchema = JSON.parse(fs.readFileSync(schemaFilePath, 'utf-8'));

    const markdownOutput = schemaToMarkdown(expectedSchema);

    //expect(expectedSchema).toEqual(schema);
    expect(markdownOutput).toMatchSnapshot();
  });
});
