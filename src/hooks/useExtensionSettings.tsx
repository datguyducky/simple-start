import { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { browser } from 'wxt/browser';

import {
	constants,
	defaultCapsuleSettings,
	defaultListSettings,
	defaultGeneralSettings,
} from '@/common/constants';
import {
	type AllExtensionSettings,
	type CapsuleSettings,
	type ListSettings,
	type GeneralSettings,
} from '@/types/settingsValues';

import { ExtensionSettingsContext } from '@/context/ExtensionSettingsContext';
import { extensionSettingsStorage } from '@/storage/extensionStorage';

const isBookmarkNotFoundError = (error: unknown) => {
	return error instanceof Error && error.message === "Can't find bookmark for id.";
};

const getCapsuleSettings = (settings: AllExtensionSettings): CapsuleSettings => ({
	capsuleSpacing: settings.capsuleSpacing,
	capsuleSize: settings.capsuleSize,
	capsuleIconSize: settings.capsuleIconSize,
	capsuleLabelSize: settings.capsuleLabelSize,
	capsuleLabelItalic: settings.capsuleLabelItalic,
	capsuleLabelBold: settings.capsuleLabelBold,
	capsuleLabelColor: settings.capsuleLabelColor,
	capsuleHiddenName: settings.capsuleHiddenName,
	capsuleIsHeart: settings.capsuleIsHeart,
});

const getListSettings = (settings: AllExtensionSettings): ListSettings => ({
	listHiddenName: settings.listHiddenName,
	listHiddenUrl: settings.listHiddenUrl,
	listNameItalic: settings.listNameItalic,
	listNameBold: settings.listNameBold,
	listUrlItalic: settings.listUrlItalic,
	listUrlBold: settings.listUrlBold,
	listUrlColor: settings.listUrlColor,
	listNameColor: settings.listNameColor,
	listVerticalPadding: settings.listVerticalPadding,
	listHorizontalPadding: settings.listHorizontalPadding,
	listSpacing: settings.listSpacing,
	listIconSize: settings.listIconSize,
	listNameSize: settings.listNameSize,
	listUrlSize: settings.listUrlSize,
	listUseStrippedRows: settings.listUseStrippedRows,
});

const getGeneralSettings = (settings: AllExtensionSettings): GeneralSettings => ({
	oneView: settings.oneView,
	oneViewHeadingGap: settings.oneViewHeadingGap,
	oneViewCategoriesGap: settings.oneViewCategoriesGap,
});

const hasCapsuleSettingsChangedFromDefault = (settings: CapsuleSettings) => {
	return (
		settings.capsuleSpacing !== defaultCapsuleSettings.capsuleSpacing ||
		settings.capsuleSize !== defaultCapsuleSettings.capsuleSize ||
		settings.capsuleIconSize !== defaultCapsuleSettings.capsuleIconSize ||
		settings.capsuleLabelSize !== defaultCapsuleSettings.capsuleLabelSize ||
		settings.capsuleLabelItalic !== defaultCapsuleSettings.capsuleLabelItalic ||
		settings.capsuleLabelBold !== defaultCapsuleSettings.capsuleLabelBold ||
		settings.capsuleLabelColor !== defaultCapsuleSettings.capsuleLabelColor ||
		settings.capsuleHiddenName !== defaultCapsuleSettings.capsuleHiddenName ||
		settings.capsuleIsHeart !== defaultCapsuleSettings.capsuleIsHeart
	);
};

const hasListSettingsChangedFromDefault = (settings: ListSettings) => {
	return (
		settings.listHiddenName !== defaultListSettings.listHiddenName ||
		settings.listHiddenUrl !== defaultListSettings.listHiddenUrl ||
		settings.listNameItalic !== defaultListSettings.listNameItalic ||
		settings.listNameBold !== defaultListSettings.listNameBold ||
		settings.listUrlItalic !== defaultListSettings.listUrlItalic ||
		settings.listUrlBold !== defaultListSettings.listUrlBold ||
		settings.listUrlColor !== defaultListSettings.listUrlColor ||
		settings.listNameColor !== defaultListSettings.listNameColor ||
		settings.listVerticalPadding !== defaultListSettings.listVerticalPadding ||
		settings.listHorizontalPadding !== defaultListSettings.listHorizontalPadding ||
		settings.listSpacing !== defaultListSettings.listSpacing ||
		settings.listIconSize !== defaultListSettings.listIconSize ||
		settings.listNameSize !== defaultListSettings.listNameSize ||
		settings.listUrlSize !== defaultListSettings.listUrlSize ||
		settings.listUseStrippedRows !== defaultListSettings.listUseStrippedRows
	);
};

const hasGeneralSettingsChangedFromDefault = (settings: GeneralSettings) => {
	return (
		settings.oneView !== defaultGeneralSettings.oneView ||
		settings.oneViewHeadingGap !== defaultGeneralSettings.oneViewHeadingGap ||
		settings.oneViewCategoriesGap !== defaultGeneralSettings.oneViewCategoriesGap
	);
};

export const useExtensionSettings = () => {
	const { currentSettings, setCurrentSettings } = useContext(ExtensionSettingsContext);
	const [viewLoading, setViewLoading] = useState<boolean>(true);

	const saveExtensionSettings = useCallback(
		async (newValues: Partial<AllExtensionSettings>) => {
			const nextSettings = {
				...currentSettings,
				...newValues,
			};

			await extensionSettingsStorage.setValue(nextSettings);
			setCurrentSettings(nextSettings);
		},
		[currentSettings],
	);

	useLayoutEffect(() => {
		const getExtensionSettings = async () => {
			const storedSettings = await extensionSettingsStorage.getValue();
			const defaultCategory = storedSettings.defaultCategory;

			if (typeof defaultCategory === 'string' && defaultCategory.length > 0) {
				const extensionRootId = (
					await browser.bookmarks.search({ title: 'simplestart' })
				)[0]?.id;

				try {
					const categoryDetails = (await browser.bookmarks.get(defaultCategory))[0];

					if (categoryDetails.parentId !== extensionRootId) {
						await saveExtensionSettings({ defaultCategory: '' });
						setViewLoading(false);
						return;
					}
				} catch (error: unknown) {
					if (isBookmarkNotFoundError(error)) {
						await saveExtensionSettings({ defaultCategory: '' });
						setViewLoading(false);
						return;
					}

					throw error;
				}
			}

			setCurrentSettings(storedSettings);
			setViewLoading(false);
		};

		// Sync extension settings from storage on initial load.
		void getExtensionSettings();
	}, []);

	useEffect(() => {
		const unwatchSettings = extensionSettingsStorage.watch((newSettings) => {
			setCurrentSettings(newSettings);
		});

		return () => {
			unwatchSettings();
		};
	}, []);

	const handleNextView = async () => {
		const currentViewIndex = constants.availableViews.findIndex(
			(view) => view.id === currentSettings.currentView,
		);

		const nextView =
			currentViewIndex === constants.availableViews.length - 1
				? constants.availableViews[0]
				: constants.availableViews[currentViewIndex + 1];

		await saveExtensionSettings({
			currentView: nextView.id,
		});
	};

	const hasCapsuleSettingsChanged = () => {
		return hasCapsuleSettingsChangedFromDefault(getCapsuleSettings(currentSettings));
	};

	const hasListSettingsChanged = () => {
		return hasListSettingsChangedFromDefault(getListSettings(currentSettings));
	};

	const hasGeneralSettingsChanged = () => {
		return hasGeneralSettingsChangedFromDefault(getGeneralSettings(currentSettings));
	};

	const toggleOneView = async () => {
		const currentGeneralSettings = getGeneralSettings(currentSettings);
		const nextGeneralSettings = {
			...currentGeneralSettings,
			oneView: !currentGeneralSettings.oneView,
		};

		await saveExtensionSettings(nextGeneralSettings);
	};

	const toggleCapsuleIsHeart = async () => {
		await saveExtensionSettings({
			capsuleIsHeart: !currentSettings.capsuleIsHeart,
		});
	};

	return {
		extensionSettings: currentSettings,
		currentView: currentSettings.currentView,
		handleNextView,
		viewLoading,
		saveExtensionSettings,
		hasCapsuleSettingsChanged,
		hasListSettingsChanged,
		hasGeneralSettingsChanged,
		toggleOneView,
		toggleCapsuleIsHeart,
	};
};
