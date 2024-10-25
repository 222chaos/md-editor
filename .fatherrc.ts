import { defineConfig } from 'father';

export default defineConfig({
  esm: { output: 'dist', transformer: 'esbuild' },
  html: {
    template: 'public/index.html', // 指定 HTML 模板路径
    output: 'dist/index.html', // 指定输出 HTML 文件路径
  },
});
