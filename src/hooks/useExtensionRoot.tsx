import { useContext, useEffect, useState } from 'react';
import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;
import { ExtensionContext } from '../context/extensionRoot';

// TODO: Probably rest of stuff that depends on extension root aka "simplestart" folder should be moved to here in the future
// TODO: Don't hard code "simplestart" as root name, using constant or something + maybe an option for users to change it?
export const useExtensionRoot = () => {
	const [extensionRoot, setExtensionRoot] = useState<BookmarkTreeNode | null>(null);
	const { setExtensionTree, extensionTree } = useContext(ExtensionContext);

	const getRoot = async () => {
		const root = await chrome.bookmarks.search({ title: 'simplestart' });

		if (root?.length && root?.length > 0) {
			setExtensionRoot(root[0]);
		} else {
			setExtensionRoot(null);
		}
	};

	const getExtensionTree = async () => {
		const rootId = await getRootId();
		const tree = (await chrome.bookmarks.getSubTree(rootId))?.[0]?.children;
		const renamedTree = tree
			?.map((node) => {
				const newNode = { ...node, bookmarks: node.children };
				delete newNode.children;
				return newNode;
			})
			.filter((node) => node.url === undefined);

		if (renamedTree) {
			setExtensionTree(renamedTree);
		}
	};

	const getRootId = async () => {
		const root = await chrome.bookmarks.search({ title: 'simplestart' });

		if (root?.length && root?.length > 0) {
			return root[0].id;
		} else {
			const createdRoot = await chrome.bookmarks.create({ title: 'simplestart' });
			return createdRoot.id;
		}
	};

	useEffect(() => {
		void getRoot();
		void getExtensionTree();
	}, []);

	const syncMove = async (_id: string) => {
		await getExtensionTree();
	};

	useEffect(() => {
		chrome.bookmarks.onMoved.addListener(syncMove);
		return () => {
			chrome.bookmarks.onMoved.removeListener(syncMove);
		};
	}, []);

	return {
		extensionRoot,
		extensionTree,
		getExtensionTree,
		setExtensionTree,
	};
};
