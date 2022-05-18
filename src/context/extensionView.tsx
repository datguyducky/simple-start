import { createContext, Dispatch, ReactNode, useState } from 'react';

export const ExtensionViewContext = createContext<{
	setCurrentView: Dispatch<number>;
	currentView?: number;
}>({ setCurrentView: () => null });

export const ExtensionViewProvider = ({ children }: { children: ReactNode }) => {
	const [currentView, setCurrentView] = useState<number>();

	return (
		<ExtensionViewContext.Provider value={{ currentView, setCurrentView }}>
			{children}
		</ExtensionViewContext.Provider>
	);
};
