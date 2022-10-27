import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { constants } from '../common/constants';

export type ExtensionSettingsObjects = {
	currentView: number;
	defaultCategory?: string | null;
	capsuleSpacing: number;
	capsuleSize: number;
	capsuleIconSize: number;
	capsuleLabelSize: number;
	capsuleLabelItalic: boolean;
	capsuleLabelBold: boolean;
	capsuleLabelColor: string | null;
	capsuleHiddenName: boolean;
	listHiddenName: boolean;
	listHiddenUrl: boolean;
	listNameItalic: boolean;
	listNameBold: boolean;
	listUrlItalic: boolean;
	listUrlBold: boolean;
	listUrlColor: string | null;
	listNameColor: string | null;
	listVerticalPadding: number;
	listHorizontalPadding: number;
	listSpacing: number;
	listIconSize: number;
	listNameSize: number;
	listUrlSize: number;
};

export const ExtensionSettingsContext = createContext<{
	setCurrentSettings: Dispatch<SetStateAction<ExtensionSettingsObjects>>;
	currentSettings: ExtensionSettingsObjects;
}>({
	currentSettings: {
		...constants.defaultExtensionSettings,
	},
	setCurrentSettings: () => null,
});

export const ExtensionSettingsProvider = ({ children }: { children: ReactNode }) => {
	const [currentSettings, setCurrentSettings] = useState<ExtensionSettingsObjects>(
		constants.defaultExtensionSettings,
	);

	return (
		<ExtensionSettingsContext.Provider value={{ currentSettings, setCurrentSettings }}>
			{children}
		</ExtensionSettingsContext.Provider>
	);
};
