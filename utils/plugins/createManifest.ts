import * as fs from 'fs';
import * as path from 'path';
import { manifest } from '../../src/manifest';
import { PluginOption } from 'vite';

const { resolve } = path;

const outDir = resolve(__dirname, '..', '..', 'public');

export function createManifest(): PluginOption {
	return {
		name: 'make-manifest',
		buildEnd() {
			if (!fs.existsSync(outDir)) {
				fs.mkdirSync(outDir);
			}

			const manifestPath = resolve(outDir, 'manifest.json');

			fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
		},
	};
}
