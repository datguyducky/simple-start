import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

export type ExtensionSettingsObjects = {
	currentView: number;
	defaultCategory?: string | null;
};

export const ExtensionSettingsContext = createContext<{
	setCurrentSettings: Dispatch<SetStateAction<ExtensionSettingsObjects>>;
	currentSettings?: ExtensionSettingsObjects;
}>({ setCurrentSettings: () => null });

export const ExtensionSettingsProvider = ({ children }: { children: ReactNode }) => {
	const [currentSettings, setCurrentSettings] = useState<ExtensionSettingsObjects>({
		currentView: 1,
		defaultCategory: null,
	});

	return (
		<ExtensionSettingsContext.Provider value={{ currentSettings, setCurrentSettings }}>
			{children}
		</ExtensionSettingsContext.Provider>
	);
};
