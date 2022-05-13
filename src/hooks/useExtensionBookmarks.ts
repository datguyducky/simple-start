import { useEffect, useState } from 'react';
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

export const useExtensionBookmarks = ({ categoryId }: { categoryId?: string | null }) => {
	const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);
	const [uncategorizedBookmarks, setUncategorizedBookmarks] = useState<BookmarkTreeNode[]>([]);

	useEffect(() => {
		const retrieveRoot = async () => {
			const extensionRoot = await browser.bookmarks.search({ title: 'simplestart' });
			if (extensionRoot?.length) {
				const extensionRootContent = await browser.bookmarks.getChildren(
					extensionRoot[0].id,
				);

				setUncategorizedBookmarks(
					extensionRootContent.filter((content) => content.type === 'bookmark'),
				);
			}
		};
		retrieveRoot();
	}, []);

	useEffect(() => {
		if (categoryId) {
			const retrieveCategoryBookmarks = async () => {
				const categoryBookmarks = await browser.bookmarks.getChildren(categoryId);
				setBookmarks(categoryBookmarks);
			};
			retrieveCategoryBookmarks();
		} else {
			setBookmarks([]);
		}
	}, [categoryId]);

	return {
		bookmarks,
		uncategorizedBookmarks,
	};
};
