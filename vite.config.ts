import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

import { createManifest } from './utils/plugins/createManifest';

const root = resolve(__dirname, 'src');
const pagesDir = resolve(root, 'pages');
const outDir = resolve(__dirname, 'dist');
const publicDir = resolve(__dirname, 'public');

export default defineConfig({
	plugins: [
		react({
			jsxImportSource: '@emotion/react',
			babel: {
				plugins: ['@emotion/babel-plugin'],
			},
		}),
		createManifest(),
	],
	publicDir,
	resolve: {
		alias: {
			'@components': resolve(root, 'components'),
			'@hooks': resolve(root, 'hooks'),
			'@forms': resolve(root, 'forms'),
			'@extensionTypes': resolve(root, 'types'),
			'@common': resolve(root, 'common'),
			'@modals': resolve(root, 'modals'),
			'@validation': resolve(root, 'validation'),
		},
	},
	build: {
		outDir,
		rollupOptions: {
			input: {
				newtab: resolve(pagesDir, 'newtab', 'index.html'),
				settings: resolve(pagesDir, 'settings', 'index.html'),
			},
			output: {
				entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`,
			},
		},
	},
});
