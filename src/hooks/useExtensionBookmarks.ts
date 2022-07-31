import { useEffect, useState } from 'react';
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

export const useExtensionBookmarks = ({ categoryId }: { categoryId?: string | null }) => {
	const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);
	const [uncategorizedBookmarks, setUncategorizedBookmarks] = useState<BookmarkTreeNode[]>([]);

	const retrieveCategoryBookmarks = async (category: string) => {
		const categoryBookmarks = await browser.bookmarks.getChildren(category);
		setBookmarks(categoryBookmarks);
	};

	const retrieveExtensionRoot = async () => {
		const extensionRoot = await browser.bookmarks.search({ title: 'simplestart' });

		if (extensionRoot?.length) {
			const extensionRootContent = await browser.bookmarks.getChildren(extensionRoot[0].id);

			setUncategorizedBookmarks(
				extensionRootContent.filter((content) => content.type === 'bookmark'),
			);
		}
	};

	useEffect(() => {
		retrieveExtensionRoot();
	}, []);

	useEffect(() => {
		if (categoryId) {
			retrieveCategoryBookmarks(categoryId);
		} else {
			setBookmarks([]);
		}
	}, [categoryId]);

	const createBookmark = async ({
		name,
		url,
		bookmarkCategoryId,
	}: {
		name: string;
		url: string;
		bookmarkCategoryId?: string;
	}) => {
		const extensionRootFolder = await browser.bookmarks.search({ title: 'simplestart' });

		await browser.bookmarks.create({
			parentId: bookmarkCategoryId ? bookmarkCategoryId : extensionRootFolder[0].id,
			title: name,
			url: url,
			type: 'bookmark',
		});

		if (bookmarkCategoryId) {
			await retrieveCategoryBookmarks(bookmarkCategoryId);
		} else {
			await retrieveExtensionRoot();
		}
	};

	const editBookmark = async ({
		id,
		bookmarkName,
		bookmarkUrl,
		bookmarkCategoryId,
	}: {
		id: string;
		bookmarkName: string;
		bookmarkUrl: string;
		bookmarkCategoryId?: string;
	}) => {
		await browser.bookmarks.update(id, {
			title: bookmarkName,
			url: bookmarkUrl,
		});

		if (bookmarkCategoryId) {
			await browser.bookmarks.move(id, {
				parentId: bookmarkCategoryId,
			});
		} else {
			const extensionRootFolder = await browser.bookmarks.search({ title: 'simplestart' });
			await browser.bookmarks.move(id, {
				parentId: extensionRootFolder[0]?.id,
			});
		}
	};

	const removeBookmark = async ({ id }: { id: string }) => {
		const bookmarkDetails = await browser.bookmarks.get(id);

		await browser.bookmarks.removeTree(id);
		if (bookmarkDetails[0]?.parentId) {
			await retrieveCategoryBookmarks(bookmarkDetails[0]?.parentId);
		}
	};

	return {
		bookmarks,
		uncategorizedBookmarks,
		createBookmark,
		editBookmark,
		removeBookmark,
	};
};
