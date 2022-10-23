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
		const formattedName = `created-theme-${name
			.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)!
			.map((x) => x.toLowerCase())
			.join('-')}`;

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

	const editCustomTheme = async (
		name: string,
		oldName: string,
		themeColors: Record<string, any>,
	) => {
		const formattedName = `created-theme-${name
			.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)!
			.map((x) => x.toLowerCase())
			.join('-')}`;

		const isExistingTheme = await browser.storage.sync.get(formattedName);
		if (Object.values(isExistingTheme).length > 0 && formattedName !== oldName) {
			throw new Error('CUSTOM_THEME_EXISTS');
		}

		// creating or updating theme by passed named
		await browser.storage.sync.set({
			[formattedName]: { colors: themeColors },
		});

		// update existing customTheme in local state, or remove old one and add the new one to local state
		if (formattedName === oldName) {
			setLocalCustomThemes((prevState) =>
				prevState.map((el) =>
					el.name === formattedName ? { ...el, colors: themeColors } : el,
				),
			);
		} else {
			// also removing old theme from local storage if we're updating under a new name
			await browser.storage.sync.remove(oldName);

			setLocalCustomThemes((prevState) => [
				...prevState.filter((item) => item.name !== oldName),
				{ name: formattedName, colors: themeColors },
			]);
		}
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

	const removeCustomTheme = async (name: string) => {
		try {
			// removing selected theme for local (state) and from the extension storage
			const newCustomThemes = localCustomThemes.filter((theme) => theme.name !== name);
			setLocalCustomThemes(newCustomThemes);

			await browser.storage.sync.remove(name);

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
