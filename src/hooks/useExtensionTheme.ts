import { useCallback, useLayoutEffect, useEffect, useState } from 'react';

type UseExtensionThemeProps = {
	key: string;
	defaultValue?: string;
};

export const useExtensionTheme = ({ key, defaultValue = 'light' }: UseExtensionThemeProps) => {
	const [localTheme, setLocalTheme] = useState();
	const [localCustomThemes, setLocalCustomThemes] = useState<Record<string, unknown>[]>();

	// getting theme from browser storage on page load
	useLayoutEffect(() => {
		const getStorageTheme = async () => {
			if (typeof window === 'undefined') {
				return defaultValue;
			}

			const storedTheme = await browser.storage.sync.get(key);
			if (Object.values(storedTheme).length > 0) {
				setLocalTheme(storedTheme[key]);
			} else {
				setLocalTheme(undefined);
			}
		};
		getStorageTheme();
	}, []);

	// save theme in browser storage and state
	const setLocalStorageValue = useCallback((val: any) => {
		browser.storage.sync.set({ [key]: val });
		setLocalTheme(val);
	}, []);

	// making sure that theme is correctly updated also on other tabs that are currently opened
	useEffect(() => {
		browser.storage.onChanged.addListener((changes) => {
			if (changes?.simpleStartTheme) {
				setLocalTheme(changes.simpleStartTheme.newValue);
			}
		});
		return () => browser.storage.onChanged.removeListener(setLocalStorageValue);
	}, []);

	// todo: proper type for colors object
	// saving custom theme in browser sync storage and in state for local use
	const saveCustomTheme = async (name: string, themeColors: Record<string, any>) => {
		const formattedName = name.toLowerCase().replace(/ /g, '-');

		const isExistingTheme = await browser.storage.sync.get(`created-theme-${formattedName}`);
		if (Object.values(isExistingTheme).length > 0) {
			throw new Error('CUSTOM_THEME_EXISTS');
		}

		await browser.storage.sync.set({
			['created-theme-' + formattedName]: { colors: themeColors },
		});
		setLocalCustomThemes((prevState) => [
			...prevState,
			{ name: 'created-theme-' + formattedName, colors: themeColors },
		]);
	};

	// retrieved all saved custom themes on load
	useEffect(() => {
		getSavedCustomThemes();
	}, []);

	// every custom theme starts with a "created-theme" key, we filter them all here and add key as object "name" property
	const getSavedCustomThemes = async () => {
		const customThemes = await browser.storage.sync.get();
		setLocalCustomThemes(
			Object.entries(customThemes)
				.filter(([key]) => key.includes('created-theme'))
				.map(([key, object]) => ({ name: key, ...object })),
		);
	};

	return {
		theme: localTheme === undefined ? defaultValue : localTheme,
		setTheme: setLocalStorageValue,
		saveCustomTheme,
		customThemes: localCustomThemes,
	};
};
