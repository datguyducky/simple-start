import { defineConfig } from 'wxt';

export default defineConfig({
	modules: ['@wxt-dev/module-react'],
	srcDir: 'src',
	imports: false,
	manifest: {
		name: 'Simple Start',
		permissions: ['bookmarks', 'storage'],
		browser_specific_settings: {
			gecko: {
				id: '{6938c509-173c-416e-b440-69a7218af76f}',
				strict_min_version: '55.0',
				data_collection_permissions: {
					required: ['none'],
				},
			},
		},
	},
});
