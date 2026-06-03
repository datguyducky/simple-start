import { browser } from 'wxt/browser';
import { type BookmarkTreeNode } from '@/types/browserExtend';

const EXTENSION_ROOT_TITLE = 'simplestart';

let extensionRootIdPromise: Promise<string> | null = null;

export const getExtensionRootId = async () => {
	if (extensionRootIdPromise) {
		return extensionRootIdPromise;
	}

	extensionRootIdPromise = (async () => {
		const existingRoot = await browser.bookmarks.search({ title: EXTENSION_ROOT_TITLE });

		if (existingRoot.length > 0) {
			return existingRoot[0].id;
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
	const root = await browser.bookmarks.search({ title: EXTENSION_ROOT_TITLE });

	if (root.length === 0) {
		return null;
	}

	return root[0];
};
