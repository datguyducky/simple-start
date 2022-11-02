import { useContext, useEffect, useLayoutEffect, useState } from 'react';

import { constants } from '../common/constants';

import { ExtensionSettingsContext } from '../context/extensionSettings';
import StorageChange = browser.storage.StorageChange;

export const useExtensionSettings = () => {
	const { currentSettings, setCurrentSettings } = useContext(ExtensionSettingsContext);
	const [viewLoading, setViewLoading] = useState<boolean>(true);

	useLayoutEffect(() => {
		const getExtensionSettings = async () => {
			const storage = await browser.storage.sync.get('extensionSettings');
			if (storage?.extensionSettings) {
				setCurrentSettings({ ...currentSettings, ...storage.extensionSettings });
			}
			setViewLoading(false);
		};

		getExtensionSettings();
	}, []);

	const handleSettingsChanged = (changes: { [key: string]: StorageChange }) => {
		if (changes?.extensionSettings) {
			setCurrentSettings(changes.extensionSettings.newValue);
		}
	};

	useEffect(() => {
		browser.storage.onChanged.addListener(handleSettingsChanged);
		return () => browser.storage.onChanged.removeListener(handleSettingsChanged);
	}, []);

	const handleNextView = async () => {
		const currentViewIndex = constants.availableViews.findIndex(
			(view) => view.id === currentSettings?.currentView,
		);

		// when switching from last view to another one - switch to the first view in an array
		if (currentViewIndex === constants.availableViews.length - 1) {
			await browser.storage.sync.set({
				extensionSettings: {
					...currentSettings,
					currentView: constants.availableViews[0].id,
				},
			});

			setCurrentSettings((prevSettings) => ({
				...prevSettings,
				currentView: constants.availableViews[0].id,
			}));
		}
		// next view in an array
		else {
			await browser.storage.sync.set({
				extensionSettings: {
					...currentSettings,
					currentView: constants.availableViews[currentViewIndex + 1].id,
				},
			});

			setCurrentSettings((prevSettings) => ({
				...prevSettings,
				currentView: constants.availableViews[currentViewIndex + 1].id,
			}));
		}
	};

	const handleSetDefaultCategory = async ({
		newDefaultCategory,
	}: {
		newDefaultCategory: string;
	}) => {
		await browser.storage.sync.set({
			extensionSettings: {
				...currentSettings,
				defaultCategory: newDefaultCategory,
			},
		});
		setCurrentSettings((prevSettings) => ({
			...prevSettings,
			defaultCategory: newDefaultCategory,
		}));
	};

	// todo: better type for newValues argument
	// todo: use this to save every setting? For example "defaultCategory" or "currentView"?
	const saveExtensionSettings = async (newValues: Record<string, unknown>) => {
		await browser.storage.sync.set({
			extensionSettings: {
				...currentSettings,
				...newValues,
			},
		});

		setCurrentSettings((prevSettings) => ({
			...prevSettings,
			...newValues,
		}));
	};

	return {
		extensionSettings: currentSettings,
		currentView: currentSettings?.currentView,
		handleNextView,
		handleSetDefaultCategory,
		viewLoading,
		saveExtensionSettings,
	};
};
