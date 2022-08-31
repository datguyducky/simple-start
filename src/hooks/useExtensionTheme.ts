import { useCallback, useLayoutEffect, useEffect, useState } from 'react';

type UseExtensionThemeProps = {
	key: string;
	defaultValue?: string;
};

export const useExtensionTheme = ({ key, defaultValue = 'light' }: UseExtensionThemeProps) => {
	const [value, setValue] = useState();

	// getting theme from browser storage on page load
	useLayoutEffect(() => {
		const getStorageTheme = async () => {
			if (typeof window === 'undefined') {
				return defaultValue;
			}

			const storedTheme = await browser.storage.sync.get(key);
			if (Object.values(storedTheme).length > 0) {
				setValue(storedTheme[key]);
			} else {
				setValue(undefined);
			}
		};
		getStorageTheme();
	}, []);

	// save theme in browser storage and state
	const setLocalStorageValue = useCallback((val: any) => {
		browser.storage.sync.set({ [key]: val });
		setValue(val);
	}, []);

	// making sure that theme is correctly updated also on other tabs that are currently opened
	useEffect(() => {
		browser.storage.onChanged.addListener((changes) => {
			if (changes?.simpleStartTheme) {
				setValue(changes.simpleStartTheme.newValue);
			}
		});
		return () => browser.storage.onChanged.removeListener(setLocalStorageValue);
	}, []);

	// todo: proper type for colors object
	const saveCustomThemeToStorage = async (name: string, themeColors: Record<string, any>) => {
		const formattedName = name.toLowerCase().replace(/ /g, '-');

		const isExistingTheme = await browser.storage.sync.get(`created-theme-${formattedName}`);
		if (Object.values(isExistingTheme).length > 0) {
			throw new Error('CUSTOM_THEME_EXISTS');
		}

		await browser.storage.sync.set({
			['created-theme-' + formattedName]: { colors: themeColors },
		});
	};

	return {
		theme: value === undefined ? defaultValue : value,
		setTheme: setLocalStorageValue,
		saveCustomThemeToStorage,
	};
};
