import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

// TODO: This probably could just be an only provider/context in the whole extension, so stuff like settings could/should be moved here as well
export const ExtensionContext = createContext<{
	extensionRoot: chrome.bookmarks.BookmarkTreeNode | null;
	extensionTree: Record<string, unknown>[] | null;
	setExtensionTree: Dispatch<SetStateAction<Record<string, unknown>[] | null>>;
	setExtensionRoot: Dispatch<SetStateAction<BookmarkTreeNode | null>>;
}>({
	extensionRoot: null,
	extensionTree: null,
	setExtensionTree: () => null,
	setExtensionRoot: () => null,
});

export const ExtensionProvider = ({ children }: { children: ReactNode }) => {
	const [extensionRoot, setExtensionRoot] = useState<BookmarkTreeNode | null>(null);
	const [extensionTree, setExtensionTree] = useState<Record<string, unknown>[] | null>(null);

	return (
		<ExtensionContext.Provider
			value={{ extensionRoot, extensionTree, setExtensionTree, setExtensionRoot }}
		>
			{children}
		</ExtensionContext.Provider>
	);
};
