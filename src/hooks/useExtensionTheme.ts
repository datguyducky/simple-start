import { useCallback, useLayoutEffect, useEffect, useState } from 'react';

type UseExtensionThemeProps = {
	key: string;
	defaultValue?: string;
};

export const useExtensionTheme = ({ key, defaultValue = 'light' }: UseExtensionThemeProps) => {
	const [localTheme, setLocalTheme] = useState();
	const [localCustomThemes, setLocalCustomThemes] = useState<Record<string, unknown>[]>([]);

	// getting theme from browser storage on page load
	useLayoutEffect(() => {
		const getStorageTheme = async () => {
			if (typeof window === 'undefined') {
				return defaultValue;
			}

			const storedTheme = await chrome.storage.sync.get(key);
			if (Object.values(storedTheme).length > 0) {
				setLocalTheme(storedTheme[key]);
			} else {
				setLocalTheme(undefined);
			}
		};
		getStorageTheme();
	}, []);

	// retrieved all saved custom themes on load
	useLayoutEffect(() => {
		getSavedCustomThemes();
	}, []);

	// every custom theme starts with a "created-theme" key, we filter them all here and add key as object "name" property
	const getSavedCustomThemes = async () => {
		const customThemes = await chrome.storage.sync.get();
		setLocalCustomThemes(
			Object.entries(customThemes)
				.filter(([key]) => key.includes('created-theme'))
				.map(([key, object]) => ({ name: key, ...object })),
		);
	};

	// save theme in browser storage and state
	const setLocalStorageValue = useCallback((val: any) => {
		chrome.storage.sync.set({ [key]: val });
		setLocalTheme(val);
	}, []);

	const syncSavedCustomThemes = async (changes: any) => {
		const createdThemeKey = Object.keys(changes).find((key) => key.includes('created-theme'));

		// when existing was edited or a new one was added then we call a function to retrieve updated themes in storage
		// and store them in local state - this will also sync the changes between all the tabs of the extension
		if (createdThemeKey) {
			await getSavedCustomThemes();
		}

		if (changes?.simpleStartTheme) {
			setLocalTheme(changes.simpleStartTheme.newValue);
		}
	};

	// making sure that theme is correctly updated also on other tabs that are currently opened
	useEffect(() => {
		chrome.storage.onChanged.addListener(syncSavedCustomThemes);
		return () => chrome.storage.onChanged.removeListener(syncSavedCustomThemes);
	}, []);

	// todo: proper type for colors object
	// saving custom theme in browser sync storage and in state for local use
	const saveCustomTheme = async (name: string, themeColors: Record<string, any>) => {
		const formattedName = `created-theme-${name
			.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)!
			.map((x) => x.toLowerCase())
			.join('-')}`;

		const isExistingTheme = await chrome.storage.sync.get(formattedName);
		if (Object.values(isExistingTheme).length > 0) {
			throw new Error('CUSTOM_THEME_EXISTS');
		}

		await chrome.storage.sync.set({
			[formattedName]: { colors: themeColors },
		});
	};

	const editCustomTheme = async (
		name: string,
		oldName: string,
		themeColors: Record<string, any>,
	) => {
		const formattedName = `created-theme-${name
			.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)!
			.map((x) => x.toLowerCase())
			.join('-')}`;

		const isExistingTheme = await chrome.storage.sync.get(formattedName);
		if (Object.values(isExistingTheme).length > 0 && formattedName !== oldName) {
			throw new Error('CUSTOM_THEME_EXISTS');
		}

		// creating or updating theme by passed named
		await chrome.storage.sync.set({
			[formattedName]: { colors: themeColors },
		});

		// when edited theme was updated under a different name then we delete the old one from the storage
		if (formattedName !== oldName) {
			await chrome.storage.sync.remove(oldName);

			// if current set theme is saved under a different one then we make sure that it's now set under the new name
			if (oldName === localTheme) {
				await chrome.storage.sync.set({ [key]: formattedName });
			}
		}
	};

	const removeCustomTheme = async (name: string) => {
		try {
			// removing selected theme for local (state) and from the extension storage
			const newCustomThemes = localCustomThemes.filter((theme) => theme.name !== name);
			setLocalCustomThemes(newCustomThemes);

			await chrome.storage.sync.remove(name);

			// when selected theme is removed and is currently set active then the extension theme is reset to "light" version
			if (localTheme === name) {
				setLocalStorageValue('light');
			}
		} catch (error) {
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
