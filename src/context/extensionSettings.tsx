import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { constants } from '../common/constants';
import { AllExtensionSettings } from '../types/settingsValues';

export const ExtensionSettingsContext = createContext<{
	setCurrentSettings: Dispatch<SetStateAction<AllExtensionSettings>>;
	currentSettings: AllExtensionSettings;
}>({
	currentSettings: {
		...constants.defaultExtensionSettings,
	},
	setCurrentSettings: () => null,
});

export const ExtensionSettingsProvider = ({ children }: { children: ReactNode }) => {
	const [currentSettings, setCurrentSettings] = useState<AllExtensionSettings>(
		constants.defaultExtensionSettings,
	);

	return (
		<ExtensionSettingsContext.Provider value={{ currentSettings, setCurrentSettings }}>
			{children}
		</ExtensionSettingsContext.Provider>
	);
};
