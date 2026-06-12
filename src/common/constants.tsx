/* eslint-disable react-refresh/only-export-components */

import {
	type AllExtensionSettings,
	type CapsuleSettings,
	type ListSettings,
	type GeneralSettings,
} from '@/types/settingsValues';

export type AvailableViewIcon = 'capsules' | 'list';

type AvailableView = {
	id: number;
	icon: AvailableViewIcon;
	title: 'Capsules' | 'List';
};

type ExampleBookmark = {
	id: number;
	name: string;
	url: string;
};

type Constants = {
	availableViews: AvailableView[];
	defaultExtensionSettings: AllExtensionSettings;
	exampleBookmarks: ExampleBookmark[];
};

export const constants: Constants = {
	availableViews: [
		{
			id: 1,
			icon: 'capsules',
			title: 'Capsules',
		},
		{
			id: 3,
			icon: 'list',
			title: 'List',
		},
	],
	defaultExtensionSettings: {
		// just extension settings
		currentView: 1,
		defaultCategory: null,
		oneView: false,
		oneViewHeadingGap: 8,
		oneViewCategoriesGap: 32,
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

export const defaultListSettings: ListSettings = {
	listHiddenName: constants.defaultExtensionSettings.listHiddenName,
	listHiddenUrl: constants.defaultExtensionSettings.listHiddenUrl,
	listNameItalic: constants.defaultExtensionSettings.listNameItalic,
	listNameBold: constants.defaultExtensionSettings.listNameBold,
	listUrlItalic: constants.defaultExtensionSettings.listUrlItalic,
	listUrlBold: constants.defaultExtensionSettings.listUrlBold,
	listUrlColor: constants.defaultExtensionSettings.listUrlColor,
	listNameColor: constants.defaultExtensionSettings.listNameColor,
	listVerticalPadding: constants.defaultExtensionSettings.listVerticalPadding,
	listHorizontalPadding: constants.defaultExtensionSettings.listHorizontalPadding,
	listSpacing: constants.defaultExtensionSettings.listSpacing,
	listIconSize: constants.defaultExtensionSettings.listIconSize,
	listNameSize: constants.defaultExtensionSettings.listNameSize,
	listUrlSize: constants.defaultExtensionSettings.listUrlSize,
	listUseStrippedRows: constants.defaultExtensionSettings.listUseStrippedRows,
};

export const defaultGeneralSettings: GeneralSettings = {
	oneView: constants.defaultExtensionSettings.oneView,
	oneViewHeadingGap: constants.defaultExtensionSettings.oneViewHeadingGap,
	oneViewCategoriesGap: constants.defaultExtensionSettings.oneViewCategoriesGap,
};

export const defaultCapsuleSettings: CapsuleSettings = {
	capsuleSpacing: constants.defaultExtensionSettings.capsuleSpacing,
	capsuleSize: constants.defaultExtensionSettings.capsuleSize,
	capsuleIconSize: constants.defaultExtensionSettings.capsuleIconSize,
	capsuleLabelSize: constants.defaultExtensionSettings.capsuleLabelSize,
	capsuleLabelItalic: constants.defaultExtensionSettings.capsuleLabelItalic,
	capsuleLabelBold: constants.defaultExtensionSettings.capsuleLabelBold,
	capsuleLabelColor: constants.defaultExtensionSettings.capsuleLabelColor,
	capsuleHiddenName: constants.defaultExtensionSettings.capsuleHiddenName,
};

// Keyboard shortcuts, to be used with Mantine's useHotkeys hook, make sure to capitalize keys and labels. Label is used only on the KeyboardShortcutsPopover component.
// https://mantine.dev/hooks/use-hotkeys/
export const SHORTCUTS = {
	openBookmarks: {
		keys: 'mod + Number',
		label: 'Open bookmarks 1–10',
	},

	addBookmark: {
		keys: 'mod + B',
		label: 'Add bookmark',
	},

	createCategory: {
		keys: 'mod + Shift + B',
		label: 'Create category',
	},

	switchView: {
		keys: 'mod + S',
		label: 'Switch view',
	},

	toggleOneView: {
		keys: 'mod + Shift + S',
		label: 'Toggle one view',
	},

	settings: {
		keys: 'mod + ,',
		label: 'Open settings',
	},

	displayShortcuts: {
		keys: 'mod + /',
		label: 'Show shortcuts',
	},
} as const;

export const OPEN_BOOKMARK_SHORTCUTS = [
	{
		keys: 'mod + 1',
		bookmarkIndex: 0,
	},
	{
		keys: 'mod + 2',
		bookmarkIndex: 1,
	},
	{
		keys: 'mod + 3',
		bookmarkIndex: 2,
	},
	{
		keys: 'mod + 4',
		bookmarkIndex: 3,
	},
	{
		keys: 'mod + 5',
		bookmarkIndex: 4,
	},
	{
		keys: 'mod + 6',
		bookmarkIndex: 5,
	},
	{
		keys: 'mod + 7',
		bookmarkIndex: 6,
	},
	{
		keys: 'mod + 8',
		bookmarkIndex: 7,
	},
	{
		keys: 'mod + 9',
		bookmarkIndex: 8,
	},
	{
		keys: 'mod + 0',
		bookmarkIndex: 9,
	},
] as const;

export const ALL_SHORTCUTS = Object.values(SHORTCUTS);

export const FAVICONS_API_URL = 'https://simple-start-api.duckybox.mytymon.com';
