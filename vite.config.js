import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const root = process.cwd();

export default defineConfig({
  plugins: [
    {
      name: 'copy-static-assets',
      closeBundle() {
        const copyDir = (src, dest) => {
          if (!existsSync(src)) return;
          if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
          for (const item of readdirSync(src, { withFileTypes: true })) {
            const s = join(src, item.name);
            const d = join(dest, item.name);
            item.isDirectory() ? copyDir(s, d) : copyFileSync(s, d);
          }
        };
        copyDir(join(root, 'assets'), join(root, 'dist', 'assets'));
        if (existsSync(join(root, 'certificate.js'))) {
          copyFileSync(join(root, 'certificate.js'), join(root, 'dist', 'certificate.js'));
        }
      }
    }
  ]
});
