import * as fs from 'fs';
import * as path from 'path';
import { manifest } from '../../src/manifest';
import { PluginOption } from 'vite';

const { resolve } = path;

const outDir = resolve(__dirname, '..', '..', 'public');

function filterKeysForChrome(
	obj: Record<string, unknown>,
	keys: string[],
): Record<string, unknown> {
	if (process.env.BROWSER !== 'chrome') {
		return obj;
	}

	return Object.keys(obj).reduce((acc, key) => {
		if (!keys.includes(key)) {
			acc[key] = obj[key];
		}
		return acc;
	}, {} as Record<string, unknown>);
}

export function createManifest(): PluginOption {
	return {
		name: 'make-manifest',
		buildEnd() {
			if (!fs.existsSync(outDir)) {
				fs.mkdirSync(outDir);
			}

			const manifestPath = resolve(outDir, 'manifest.json');
			const filteredManifest = filterKeysForChrome(manifest, [
				'browser_specific_settings',
				'chrome_settings_overrides',
			]);

			fs.writeFileSync(manifestPath, JSON.stringify(filteredManifest, null, 2), {
				flag: 'w',
			});
		},
	};
}
