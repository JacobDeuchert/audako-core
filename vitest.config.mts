import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

/**
 * `lib/` uses ESM-style `.js` import specifiers that point at `.ts` sources. Vite does not
 * remap those, so resolve them back to the TypeScript files for tests.
 */
const jsToTs = {
  name: 'audako-core-js-to-ts',
  enforce: 'pre' as const,
  resolveId(source: string, importer?: string) {
    if (!importer || !source.startsWith('.') || !source.endsWith('.js')) {
      return null;
    }
    const candidate = resolve(dirname(importer), source.replace(/\.js$/, '.ts'));
    return existsSync(candidate) ? candidate : null;
  },
};

export default defineConfig({
  plugins: [jsToTs],
  test: {
    // Only the vitest suites; test/index.ts is a manual scratch project and stays untouched.
    include: ['test/**/*.test.ts'],
    environment: 'node',
  },
});
