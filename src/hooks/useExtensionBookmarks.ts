import { useEffect, useState } from 'react';
import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;
import BookmarkChangeInfo = chrome.bookmarks.BookmarkChangeInfo;
import BookmarkRemoveInfo = chrome.bookmarks.BookmarkRemoveInfo;
import { useExtensionRoot } from '@hooks/useExtensionRoot';
import { isChrome } from '../utils/isChrome';

// TODO: It starts to get really messy here, should be refactored a little bit - maybe even categories and bookmarks should be under one file?
export const useExtensionBookmarks = ({ categoryId }: { categoryId?: string | null }) => {
	const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);
	const [uncategorizedBookmarks, setUncategorizedBookmarks] = useState<BookmarkTreeNode[]>([]);
	const { getExtensionTree, setExtensionTree, extensionRoot } = useExtensionRoot();

	const retrieveCategoryBookmarks = async (category: string) => {
		const categoryBookmarks = await chrome.bookmarks.getChildren(category);
		setBookmarks(categoryBookmarks);
	};

	const retrieveExtensionRoot = async () => {
		const extensionRoot = await chrome.bookmarks.search({ title: 'simplestart' });

		if (extensionRoot?.length && extensionRoot?.length > 0) {
			const extensionRootContent = await chrome.bookmarks.getChildren(extensionRoot[0].id);

			setUncategorizedBookmarks(
				extensionRootContent.filter((content) => content?.url !== undefined),
			);
		}
	};

	useEffect(() => {
		void retrieveExtensionRoot();
	}, []);

	useEffect(() => {
		if (categoryId) {
			void retrieveCategoryBookmarks(categoryId);
		} else {
			setBookmarks([]);
		}
	}, [categoryId]);

	// making sure that edition of a bookmark is synced between tabs and views
	const syncBookmarkChanges = async (id: string, changeInfo: BookmarkChangeInfo) => {
		if (changeInfo?.url !== undefined) {
			const updatedBookmarks = bookmarks.map((bookmark) =>
				bookmark.id === id ? { ...bookmark, ...changeInfo } : bookmark,
			);
			const updatedUncategorizedBookmarks = uncategorizedBookmarks.map((bookmark) =>
				bookmark.id === id ? { ...bookmark, ...changeInfo } : bookmark,
			);

			setBookmarks(updatedBookmarks);
			setUncategorizedBookmarks(updatedUncategorizedBookmarks);
			await getExtensionTree();
		}
	};

	// making sure that deletion of a bookmark is synced between tabs and views
	const syncBookmarkDeletion = async (id: string, removeInfo: BookmarkRemoveInfo) => {
		if (removeInfo.node.url !== undefined) {
			const cleanedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
			const cleanedUncategorizedBookmarks = uncategorizedBookmarks.filter(
				(uncategorizedBookmark) => uncategorizedBookmark.id !== id,
			);

			setBookmarks(cleanedBookmarks);
			setUncategorizedBookmarks(cleanedUncategorizedBookmarks);
			await getExtensionTree();
		}
	};

	const syncBookmarkCreation = async (_id: string, bookmark: BookmarkTreeNode) => {
		if (bookmark?.url !== undefined) {
			const extensionRoot = (await chrome.bookmarks.search({ title: 'simplestart' }))?.[0];
			if (extensionRoot?.id === bookmark.parentId) {
				const updatedUncategorizedBookmarks = [...uncategorizedBookmarks, bookmark];
				setUncategorizedBookmarks(updatedUncategorizedBookmarks);
			} else {
				const updatedBookmarks = [...bookmarks, bookmark];
				setBookmarks(updatedBookmarks);
			}

			await getExtensionTree();
		}
	};

	const syncBookmarkMove = async (id: string, moveInfo: chrome.bookmarks.BookmarkMoveInfo) => {
		const item = await chrome.bookmarks.get(id);
		if (!item?.[0]?.url) {
			return;
		}

		if (extensionRoot?.id === moveInfo.parentId) {
			await retrieveExtensionRoot();
		} else {
			await retrieveCategoryBookmarks(moveInfo.parentId);
		}

		await getExtensionTree();
	};

	useEffect(() => {
		if (bookmarks?.length > 0 || uncategorizedBookmarks?.length > 0) {
			chrome.bookmarks.onChanged.addListener(syncBookmarkChanges);
			chrome.bookmarks.onCreated.addListener(syncBookmarkCreation);
			chrome.bookmarks.onRemoved.addListener(syncBookmarkDeletion);
			chrome.bookmarks.onMoved.addListener(syncBookmarkMove);
			return () => {
				chrome.bookmarks.onChanged.removeListener(syncBookmarkChanges);
				chrome.bookmarks.onCreated.removeListener(syncBookmarkCreation);
				chrome.bookmarks.onRemoved.removeListener(syncBookmarkDeletion);
				chrome.bookmarks.onMoved.removeListener(syncBookmarkMove);
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
		const extensionRootFolder = await chrome.bookmarks.search({ title: 'simplestart' });

		await chrome.bookmarks.create({
			parentId: bookmarkCategoryId ? bookmarkCategoryId : extensionRootFolder[0].id,
			title: name,
			url: url,
		});

		if (categoryId) {
			await retrieveCategoryBookmarks(categoryId);
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
		await chrome.bookmarks.update(id, {
			title: bookmarkName,
			url: bookmarkUrl,
		});

		if (bookmarkCategoryId) {
			await chrome.bookmarks.move(id, {
				parentId: bookmarkCategoryId,
			});
		} else {
			const extensionRootFolder = await chrome.bookmarks.search({ title: 'simplestart' });
			await chrome.bookmarks.move(id, {
				parentId: extensionRootFolder[0]?.id,
			});
		}
	};

	const removeBookmark = async ({ id }: { id: string }) => {
		const bookmarkDetails = await chrome.bookmarks.get(id);

		await chrome.bookmarks.removeTree(id);
		if (bookmarkDetails[0]?.parentId) {
			await retrieveCategoryBookmarks(bookmarkDetails[0]?.parentId);
		}
	};

	const moveBookmark = async (
		id: string,
		fromIndex: number,
		toIndex?: number,
		isUncategorized?: boolean,
	) => {
		if (toIndex === undefined || toIndex === null || fromIndex === toIndex) {
			return;
		}

		// This is used so the changes are instantly visible in the UI - probably can be improved a little bit
		if (isUncategorized) {
			setUncategorizedBookmarks((prevUncategorizedBookmarks) => {
				if (prevUncategorizedBookmarks) {
					const newUncategorizedBookmarks = [...prevUncategorizedBookmarks];
					const movedBookmark = newUncategorizedBookmarks.splice(fromIndex, 1)[0];
					newUncategorizedBookmarks.splice(toIndex, 0, movedBookmark);
					return newUncategorizedBookmarks;
				}
				return null;
			});
		} else {
			setExtensionTree((prevExtensionTree) => {
				if (prevExtensionTree) {
					const newExtensionTree = [...prevExtensionTree];
					const category = newExtensionTree.find((category) =>
						category.bookmarks.some((bookmark) => bookmark.id === id),
					);
					if (category) {
						const movedBookmark = category.bookmarks.splice(fromIndex, 1)[0];
						category.bookmarks.splice(toIndex, 0, movedBookmark);
					}
					return newExtensionTree;
				}
				return null;
			});
		}

		if (fromIndex < toIndex && isChrome()) {
			toIndex++;
		}

		await chrome.bookmarks.move(id, {
			index: toIndex,
		});
	};

	return {
		bookmarks,
		uncategorizedBookmarks,
		createBookmark,
		editBookmark,
		removeBookmark,
		moveBookmark,
	};
};
