import packageJson from '../package.json';

export const manifest = {
	manifest_version: 2,
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
};
