import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import StorageChange = chrome.storage.StorageChange;

import { constants } from '@common/constants';
import { AllExtensionSettings } from '@extensionTypes/settingsValues';

import { ExtensionSettingsContext } from '../context/extensionSettings';

export const useExtensionSettings = () => {
	const { currentSettings, setCurrentSettings } = useContext(ExtensionSettingsContext);
	const [viewLoading, setViewLoading] = useState<boolean>(true);

	useLayoutEffect(() => {
		const getExtensionSettings = async () => {
			const storage = await chrome.storage.sync.get('extensionSettings');
			if (storage?.extensionSettings) {
				// This resets default category if for some reason the the extension root folder was removed somehow and the selected category doesn't really belong to Simple Start anymore
				if (storage.extensionSettings?.defaultCategory !== '') {
					const extensionRootId = (
						await chrome.bookmarks.search({ title: 'simplestart' })
					)?.[0]?.id;
					const categoryDetails = (
						await chrome.bookmarks.get(storage.extensionSettings.defaultCategory)
					)?.[0];

					if (categoryDetails?.parentId !== extensionRootId) {
						await saveExtensionSettings({ defaultCategory: '' });
						setViewLoading(false);
						return;
					}
				}

				setCurrentSettings({ ...currentSettings, ...storage.extensionSettings });
			}
			setViewLoading(false);
		};

		void getExtensionSettings();
	}, []);

	const handleSettingsChanged = (changes: { [key: string]: StorageChange }) => {
		if (changes?.extensionSettings) {
			setCurrentSettings(changes.extensionSettings.newValue);
		}
	};

	useEffect(() => {
		chrome.storage.onChanged.addListener(handleSettingsChanged);
		return () => chrome.storage.onChanged.removeListener(handleSettingsChanged);
	}, []);

	const handleNextView = async () => {
		const currentViewIndex = constants.availableViews.findIndex(
			(view) => view.id === currentSettings?.currentView,
		);

		// when switching from last view to another one - switch to the first view in an array
		if (currentViewIndex === constants.availableViews.length - 1) {
			await chrome.storage.sync.set({
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
			await chrome.storage.sync.set({
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
		await chrome.storage.sync.set({
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
