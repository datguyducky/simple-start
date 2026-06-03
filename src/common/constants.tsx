import { IconCapsuleHorizontal, IconMenu2 } from '@tabler/icons-react';

import {
	type AllExtensionSettings,
	type CapsuleSettings,
	type ListSettings,
} from '@/types/settingsValues';

type AvailableView = {
	id: number;
	icon: JSX.Element;
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
			icon: <IconCapsuleHorizontal size={18} />,
			title: 'Capsules',
		},
		{
			id: 3,
			icon: <IconMenu2 size={18} />,
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
