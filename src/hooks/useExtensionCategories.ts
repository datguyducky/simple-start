import { useEffect, useState } from 'react';
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

export const useExtensionCategories = () => {
	const [categories, setCategories] = useState<BookmarkTreeNode[]>([]);

	useEffect(() => {
		const retrieveRoot = async () => {
			const extensionRoot = await browser.bookmarks.search({ title: 'simplestart' });
			if (extensionRoot?.length) {
				const extensionCategories = await browser.bookmarks.getChildren(
					extensionRoot[0].id,
				);
				setCategories(extensionCategories.filter((content) => content.type === 'folder'));
			}
		};
		retrieveRoot();
	}, []);

	return {
		categories,
	};
};
