import { MenuIcon, ServerIcon } from '@heroicons/react/outline';

export const constants = {
	availableViews: [
		{
			id: 1,
			icon: <ServerIcon style={{ width: 18, height: 18 }} />,
			title: 'Capsules',
		},
		{
			id: 3,
			icon: <MenuIcon style={{ width: 18, height: 18 }} />,
			title: 'List',
		},
	],
	defaultExtensionSettings: {
		// just extension settings
		currentView: 1,
		defaultCategory: null,
		// settings for the capsule view
		capsuleSpacing: 24,
		capsuleSize: 64,
		capsuleIconSize: 32,
		capsuleLabelSize: 14,
		capsuleLabelItalic: false,
		capsuleLabelBold: false,
		capsuleLabelColor: null,
		capsuleHiddenName: false,
		// settings for the list view
		listHiddenName: false,
		listHiddenUrl: false,
		listNameItalic: false,
		listNameBold: false,
		listUrlItalic: false,
		listUrlBold: false,
		listUrlColor: null,
		listNameColor: null,
		listVerticalPadding: 12,
		listHorizontalPadding: 20,
		listSpacing: 4,
		listIconSize: 24,
		listNameSize: 16,
		listUrlSize: 14,
		listUseStrippedRows: false,
	},
	exampleBookmarks: [
		{ id: 1, name: 'Duckduckgo', url: 'https://duckduckgo.com' },
		{ id: 2, name: 'Stack Overflow', url: 'https://stackoverflow.com/' },
		{ id: 3, name: 'Wikipedia', url: 'https://wikipedia.org' },
	],
};

export const defaultListSettings = Object.keys(constants.defaultExtensionSettings)
	.filter((key) => key.startsWith('list'))
	.reduce((obj, key) => {
		obj[key] = constants.defaultExtensionSettings[key];
		return obj;
	}, {});

export const defaultCapsuleSettings = Object.keys(constants.defaultExtensionSettings)
	.filter((key) => key.startsWith('capsule'))
	.reduce((obj, key) => {
		obj[key] = constants.defaultExtensionSettings[key];
		return obj;
	}, {});
