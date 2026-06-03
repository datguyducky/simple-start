import { useCallback, useContext, useEffect, useState } from 'react';
import { browser } from 'wxt/browser';

import { type BookmarkTreeNode, type ExtensionCategoryTreeNode } from '@/types/browserExtend';
import { ExtensionContext } from '@/context/ExtensionRootContext';
import { findExtensionRoot, getExtensionRootId } from '@/utils/extensionRoot';

// TODO: Probably rest of stuff that depends on extension root aka "simplestart" folder should be moved to here in the future
// TODO: Don't hard code "simplestart" as root name, using constant or something + maybe an option for users to change it?
export const useExtensionRoot = () => {
	const [extensionRoot, setExtensionRoot] = useState<BookmarkTreeNode | null>(null);
	const { setExtensionTree, extensionTree } = useContext(ExtensionContext);

	const getRootId = useCallback(async () => {
		return getExtensionRootId();
	}, []);

	const getRoot = useCallback(async () => {
		const root = await findExtensionRoot();

		if (root) {
			setExtensionRoot(root);
			return;
		}

		setExtensionRoot(null);
	}, []);

	const getExtensionTree = useCallback(async () => {
		const rootId = await getRootId();
		const tree = (await browser.bookmarks.getSubTree(rootId))[0]?.children;

		const renamedTree: ExtensionCategoryTreeNode[] | undefined = tree
			?.filter((node) => node.url === undefined)
			.map((node) => ({
				...node,
				bookmarks: node.children ?? [],
			}));

		if (renamedTree) {
			setExtensionTree(renamedTree);
		}
	}, [getRootId, setExtensionTree]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		void getRoot();
		void getExtensionTree();
	}, []);

	const syncMove = useCallback(async () => {
		await getExtensionTree();
	}, [getExtensionTree]);

	useEffect(() => {
		const handleMove = () => {
			void syncMove();
		};

		browser.bookmarks.onMoved.addListener(handleMove);

		return () => {
			browser.bookmarks.onMoved.removeListener(handleMove);
		};
	}, []);

	return {
		extensionRoot,
		extensionTree,
		getExtensionTree,
		setExtensionTree,
	};
};
