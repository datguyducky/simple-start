import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { BookmarkTreeNode, ExtensionCategoryTreeNode } from '@/types/browserExtend';

export const ExtensionContext = createContext<{
	extensionRoot: BookmarkTreeNode | null;
	extensionTree: ExtensionCategoryTreeNode[] | null;
	setExtensionTree: Dispatch<SetStateAction<ExtensionCategoryTreeNode[] | null>>;
	setExtensionRoot: Dispatch<SetStateAction<BookmarkTreeNode | null>>;
}>({
	extensionRoot: null,
	extensionTree: null,
	setExtensionTree: () => null,
	setExtensionRoot: () => null,
});

export const ExtensionProvider = ({ children }: { children: ReactNode }) => {
	const [extensionRoot, setExtensionRoot] = useState<BookmarkTreeNode | null>(null);
	const [extensionTree, setExtensionTree] = useState<ExtensionCategoryTreeNode[] | null>(null);

	return (
		<ExtensionContext.Provider
			value={{ extensionRoot, extensionTree, setExtensionTree, setExtensionRoot }}
		>
			{children}
		</ExtensionContext.Provider>
	);
};
