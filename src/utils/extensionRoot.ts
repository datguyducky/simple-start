import { browser } from 'wxt/browser';
import { type BookmarkTreeNode } from '@/types/browserExtend';

const EXTENSION_ROOT_TITLE = 'simplestart';

let extensionRootIdPromise: Promise<string> | null = null;

export const getExtensionRootId = async () => {
	if (extensionRootIdPromise) {
		return extensionRootIdPromise;
	}

	extensionRootIdPromise = (async () => {
		const searchResults = await browser.bookmarks.search({ title: EXTENSION_ROOT_TITLE });
		const existingRoot = searchResults.find((result) => !result.url);

		if (existingRoot) {
			return existingRoot.id;
		}

		const createdRoot = await browser.bookmarks.create({ title: EXTENSION_ROOT_TITLE });
		return createdRoot.id;
	})();

	try {
		return await extensionRootIdPromise;
	} finally {
		extensionRootIdPromise = null;
	}
};

export const findExtensionRoot = async (): Promise<BookmarkTreeNode | null> => {
	const searchResults = await browser.bookmarks.search({ title: EXTENSION_ROOT_TITLE });
	const root = searchResults.find((result) => !result.url);

	if (!root) {
		return null;
	}

	return root;
};
