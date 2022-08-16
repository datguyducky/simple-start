import { useCallback, useLayoutEffect, useEffect, useState } from 'react';

type UseExtensionThemeProps = {
	key: string;
	defaultValue: string;
};

export const useExtensionTheme = ({ key, defaultValue }: UseExtensionThemeProps) => {
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
			setValue(changes.simpleStartTheme.newValue);
		});
		return () => browser.storage.onChanged.removeListener(setLocalStorageValue);
	}, []);

	return [value === undefined ? defaultValue : value, setLocalStorageValue] as const;
};
