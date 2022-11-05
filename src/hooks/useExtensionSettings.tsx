import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import StorageChange = browser.storage.StorageChange;

import { constants } from '@common/constants';
import { AllExtensionSettings } from '@extensionTypes/settingsValues';

import { ExtensionSettingsContext } from '../context/extensionSettings';

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

	// this is used to save settings for the extension, except the "currentView" one as that requires some extra logic to properly change it
	const saveExtensionSettings = async (newValues: Partial<AllExtensionSettings>) => {
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
		viewLoading,
		saveExtensionSettings,
	};
};
