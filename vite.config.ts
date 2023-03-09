import * as path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      formats: ['iife'],
      entry: path.resolve(__dirname, 'src/ui5ErrorCollector.js'),
      name: 'ui5ErrorCollector',
      fileName: (format) => `ui5ErrorCollector.min.js`
    }
  }
});
