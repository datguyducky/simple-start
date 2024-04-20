import packageJson from '../package.json';

export const manifest = {
	manifest_version: 3,
	name: 'Simple Start',
	version: packageJson.version,
	description: packageJson.description,
	permissions: ['bookmarks', 'storage'],

	options_ui: {
		page: 'src/pages/settings/index.html',
		open_in_tab: true,
	},

	chrome_url_overrides: {
		newtab: 'src/pages/newtab/index.html',
	},
	chrome_settings_overrides: {
		homepage: 'src/pages/newtab/index.html',
	},

	icons: {
		'48': 'icon48.png',
		'96': 'icon96.png',
	},

	browser_specific_settings: {
		gecko: {
			id: '{6938c509-173c-416e-b440-69a7218af76f}',
			strict_min_version: '55.0',
		},
	},
};
