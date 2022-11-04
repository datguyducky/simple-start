import { useEffect, useState } from 'react';
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import _OnChangedChangeInfo = browser.bookmarks._OnChangedChangeInfo;
import _OnRemovedRemoveInfo = browser.bookmarks._OnRemovedRemoveInfo;

export const useExtensionBookmarks = ({ categoryId }: { categoryId?: string | null }) => {
	const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);
	const [uncategorizedBookmarks, setUncategorizedBookmarks] = useState<BookmarkTreeNode[]>([]);

	const retrieveCategoryBookmarks = async (category: string) => {
		const categoryBookmarks = await browser.bookmarks.getChildren(category);
		setBookmarks(categoryBookmarks);
	};

	const retrieveExtensionRoot = async () => {
		const extensionRoot = await browser.bookmarks.search({ title: 'simplestart' });

		if (extensionRoot?.length && extensionRoot?.length > 0) {
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

	// making sure that edition of a bookmark is synced between tabs and views
	const syncBookmarkChanges = (id: string, changeInfo: _OnChangedChangeInfo) => {
		const updatedBookmarks = bookmarks.map((bookmark) =>
			bookmark.id === id ? { ...bookmark, ...changeInfo } : bookmark,
		);
		const updatedUncategorizedBookmarks = uncategorizedBookmarks.map((bookmark) =>
			bookmark.id === id ? { ...bookmark, ...changeInfo } : bookmark,
		);

		setBookmarks(updatedBookmarks);
		setUncategorizedBookmarks(updatedUncategorizedBookmarks);
	};

	// making sure that deletion of a bookmark is synced between tabs and views
	const syncBookmarkDeletion = (id: string, removeInfo: _OnRemovedRemoveInfo) => {
		if (removeInfo?.node?.type === 'bookmark') {
			const cleanedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
			const cleanedUncategorizedBookmarks = uncategorizedBookmarks.filter(
				(uncategorizedBookmark) => uncategorizedBookmark.id !== id,
			);

			setBookmarks(cleanedBookmarks);
			setUncategorizedBookmarks(cleanedUncategorizedBookmarks);
		}
	};

	useEffect(() => {
		if (bookmarks?.length > 0 || uncategorizedBookmarks?.length > 0) {
			browser.bookmarks.onChanged.addListener(syncBookmarkChanges);
			browser.bookmarks.onRemoved.addListener(syncBookmarkDeletion);
			return () => {
				browser.bookmarks.onChanged.removeListener(syncBookmarkChanges);
				browser.bookmarks.onRemoved.removeListener(syncBookmarkDeletion);
			};
		}
	}, [bookmarks, uncategorizedBookmarks]);

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

		await retrieveCategoryBookmarks(categoryId || extensionRootFolder[0].id);
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
