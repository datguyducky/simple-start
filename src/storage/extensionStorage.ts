import { storage } from '#imports';

import { constants } from '@/common/constants';
import { type AllExtensionSettings } from '@/types/settingsValues';
import { type CustomThemesByName } from '@/types/customTheme';

export const extensionSettingsStorage = storage.defineItem<AllExtensionSettings>(
	'sync:extensionSettings',
	{
		defaultValue: constants.defaultExtensionSettings,
	},
);

export const simpleStartThemeStorage = storage.defineItem<string>('sync:simpleStartTheme', {
	defaultValue: 'light',
});

export const customThemesStorage = storage.defineItem<CustomThemesByName>('sync:customThemes', {
	defaultValue: {},
});

export const customThemesMigrationStorage = storage.defineItem<boolean>(
	'sync:customThemesMigrationCompleted',
	{
		defaultValue: false,
	},
);
