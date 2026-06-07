import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { browser } from 'wxt/browser';

import {
	type CustomTheme,
	type CustomThemeColors,
	type CustomThemeSaveValues,
	type CustomThemesByName,
} from '@/types/customTheme';
import {
	customThemesMigrationStorage,
	customThemesStorage,
	simpleStartThemeStorage,
} from '@/storage/extensionStorage';

type UseExtensionThemeProps = {
	defaultValue?: string;
};

type StoredCustomTheme = {
	colors: CustomThemeColors;
	other?: {
		text?: string;
	};
};

const isStoredCustomTheme = (value: unknown): value is StoredCustomTheme => {
	return typeof value === 'object' && value !== null && 'colors' in value;
};

const formatCustomThemeName = (name: string) => {
	const nameParts =
		name.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) ?? [];

	if (nameParts.length === 0) {
		throw new Error('INVALID_CUSTOM_THEME_NAME');
	}

	return `created-theme-${nameParts.map((x) => x.toLowerCase()).join('-')}`;
};

const removeCustomThemeFromRecord = (
	customThemes: CustomThemesByName,
	themeName: string,
): CustomThemesByName => {
	return Object.fromEntries(Object.entries(customThemes).filter(([name]) => name !== themeName));
};

export const useExtensionTheme = ({ defaultValue = 'light' }: UseExtensionThemeProps = {}) => {
	const [localTheme, setLocalTheme] = useState<string | undefined>();
	const [localCustomThemes, setLocalCustomThemes] = useState<CustomTheme[]>([]);

	const migrateLegacyCustomThemes = useCallback(async () => {
		const migrationCompleted = await customThemesMigrationStorage.getValue();
		if (migrationCompleted) {
			return;
		}

		const currentCustomThemes = await customThemesStorage.getValue();
		const legacyStorage = await browser.storage.sync.get();
		const legacyCustomThemes: CustomThemesByName = {};

		for (const [storageKey, value] of Object.entries(legacyStorage)) {
			if (!storageKey.startsWith('created-theme-') || !isStoredCustomTheme(value)) {
				continue;
			}

			legacyCustomThemes[storageKey] = {
				name: storageKey,
				colors: {
					background: value.colors.background,
					'custom-primary': value.colors['custom-primary'],
				},
				other: {
					text: value.other?.text ?? value.colors.text ?? '#101113',
				},
			};
		}

		if (Object.keys(legacyCustomThemes).length > 0) {
			const migratedCustomThemes: CustomThemesByName = {
				...legacyCustomThemes,
				...currentCustomThemes,
			};

			await customThemesStorage.setValue(migratedCustomThemes);
			await browser.storage.sync.remove(Object.keys(legacyCustomThemes));
		}

		await customThemesMigrationStorage.setValue(true);
	}, []);

	const loadSavedCustomThemes = useCallback(async () => {
		const customThemes = await customThemesStorage.getValue();
		setLocalCustomThemes(Object.values(customThemes));
	}, []);

	const loadSavedTheme = useCallback(async () => {
		const savedTheme = await simpleStartThemeStorage.getValue();
		setLocalTheme(savedTheme);
	}, []);

	useLayoutEffect(() => {
		const initializeCustomThemes = async () => {
			await loadSavedTheme();
			await migrateLegacyCustomThemes();
			await loadSavedCustomThemes();
		};

		void initializeCustomThemes();
	}, []);

	const setLocalStorageValue = useCallback((val: string) => {
		void simpleStartThemeStorage.setValue(val);
		setLocalTheme(val);
	}, []);

	useEffect(() => {
		const unwatchTheme = simpleStartThemeStorage.watch((newTheme) => {
			setLocalTheme(newTheme);
		});

		const unwatchCustomThemes = customThemesStorage.watch((newCustomThemes) => {
			setLocalCustomThemes(Object.values(newCustomThemes));
		});

		return () => {
			unwatchTheme();
			unwatchCustomThemes();
		};
	}, []);

	const saveCustomTheme = async (name: string, themeColors: CustomThemeSaveValues) => {
		const formattedName = formatCustomThemeName(name);
		const customThemes = await customThemesStorage.getValue();

		if (Object.hasOwn(customThemes, formattedName)) {
			throw new Error('CUSTOM_THEME_EXISTS');
		}

		await customThemesStorage.setValue({
			...customThemes,
			[formattedName]: {
				name: formattedName,
				colors: {
					background: themeColors.background,
					'custom-primary': themeColors['custom-primary'],
				},
				other: {
					text: themeColors.text,
				},
			},
		});
	};

	const editCustomTheme = async (
		name: string,
		oldName: string,
		themeColors: CustomThemeSaveValues,
	) => {
		const formattedName = formatCustomThemeName(name);
		const customThemes = await customThemesStorage.getValue();

		if (Object.hasOwn(customThemes, formattedName) && formattedName !== oldName) {
			throw new Error('CUSTOM_THEME_EXISTS');
		}

		const updatedCustomThemes: CustomThemesByName = {
			...removeCustomThemeFromRecord(customThemes, oldName),
			[formattedName]: {
				name: formattedName,
				colors: {
					background: themeColors.background,
					'custom-primary': themeColors['custom-primary'],
				},
				other: {
					text: themeColors.text,
				},
			},
		};

		await customThemesStorage.setValue(updatedCustomThemes);

		if (formattedName !== oldName && oldName === localTheme) {
			await simpleStartThemeStorage.setValue(formattedName);
		}
	};

	const removeCustomTheme = async (name: string) => {
		try {
			const customThemes = await customThemesStorage.getValue();
			const updatedCustomThemes = removeCustomThemeFromRecord(customThemes, name);

			setLocalCustomThemes(Object.values(updatedCustomThemes));

			await customThemesStorage.setValue(updatedCustomThemes);

			if (localTheme === name) {
				setLocalStorageValue('light');
			}
		} catch (_error) {
			throw new Error('SOMETHING_WENT_WRONG');
		}
	};

	return {
		theme: localTheme === undefined ? defaultValue : localTheme,
		setTheme: setLocalStorageValue,
		saveCustomTheme,
		customThemes: localCustomThemes,
		editCustomTheme,
		removeCustomTheme,
	};
};
