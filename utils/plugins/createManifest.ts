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
			const { browser_specific_settings, ...manifestCopy } = manifest;

			fs.writeFileSync(
				manifestPath,
				JSON.stringify(
					{
						...manifestCopy,
						browser_specific_settings:
							process.env.BROWSER === 'chrome'
								? undefined
								: browser_specific_settings,
					},
					null,
					2,
				),
				{ flag: 'w' },
			);
		},
	};
}
