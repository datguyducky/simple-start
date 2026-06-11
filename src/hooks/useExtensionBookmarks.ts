import { useCallback, useEffect, useState } from 'react';
import { browser } from 'wxt/browser';

import { isChrome } from '../utils/isChrome';
import { useExtensionRoot } from './useExtensionRoot';
import { normalizeBookmarkUrl } from '@/utils/bookmarkUrl';
import {
	findExtensionRoot,
	getExtensionRootId as resolveExtensionRootId,
} from '@/utils/extensionRoot';
import {
	type BookmarkChangeInfo,
	type BookmarkMoveInfo,
	type BookmarkRemoveInfo,
	type BookmarkTreeNode,
} from '@/types/browserExtend';

type UseExtensionBookmarksProps = {
	categoryId?: string | null;
};

type CreateBookmarkValues = {
	name: string;
	url: string;
	bookmarkCategoryId?: string;
};

type EditBookmarkValues = {
	id: string;
	bookmarkName: string;
	bookmarkUrl: string;
	bookmarkCategoryId?: string;
};

export const useExtensionBookmarks = ({ categoryId }: UseExtensionBookmarksProps) => {
	const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);
	const [uncategorizedBookmarks, setUncategorizedBookmarks] = useState<BookmarkTreeNode[]>([]);
	const { getExtensionTree, setExtensionTree, extensionRoot } = useExtensionRoot();

	const retrieveCategoryBookmarks = useCallback(async (category: string) => {
		const categoryBookmarks = await browser.bookmarks.getChildren(category);
		setBookmarks(categoryBookmarks);
	}, []);

	const retrieveExtensionRoot = useCallback(async () => {
		const extensionRootFolder = await findExtensionRoot();
		if (extensionRootFolder === null) {
			setUncategorizedBookmarks([]);
			return;
		}

		const extensionRootContent = await browser.bookmarks.getChildren(extensionRootFolder.id);

		setUncategorizedBookmarks(
			extensionRootContent.filter((content) => content.url !== undefined),
		);
	}, []);

	const getExtensionRootId = useCallback(async () => {
		return resolveExtensionRootId();
	}, []);

	useEffect(() => {
		// Sync the local bookmark state with browser bookmarks when the hook mounts.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		void retrieveExtensionRoot();
	}, []);

	useEffect(() => {
		if (categoryId) {
			// Sync the local bookmark state when the selected category changes.
			// eslint-disable-next-line react-hooks/set-state-in-effect
			void retrieveCategoryBookmarks(categoryId);
			return;
		}

		setBookmarks([]);
	}, [categoryId]);

	const syncBookmarkChanges = useCallback(
		async (id: string, changeInfo: BookmarkChangeInfo) => {
			if (changeInfo.url === undefined) {
				return;
			}

			setBookmarks((prevBookmarks) =>
				prevBookmarks.map((bookmark) =>
					bookmark.id === id ? { ...bookmark, ...changeInfo } : bookmark,
				),
			);

			setUncategorizedBookmarks((prevUncategorizedBookmarks) =>
				prevUncategorizedBookmarks.map((bookmark) =>
					bookmark.id === id ? { ...bookmark, ...changeInfo } : bookmark,
				),
			);

			await getExtensionTree();
		},
		[getExtensionTree],
	);

	const syncBookmarkDeletion = useCallback(
		async (id: string, removeInfo: BookmarkRemoveInfo) => {
			if (removeInfo.node.url === undefined) {
				return;
			}

			setBookmarks((prevBookmarks) => prevBookmarks.filter((bookmark) => bookmark.id !== id));

			setUncategorizedBookmarks((prevUncategorizedBookmarks) =>
				prevUncategorizedBookmarks.filter((bookmark) => bookmark.id !== id),
			);

			await getExtensionTree();
		},
		[getExtensionTree],
	);

	const syncBookmarkCreation = useCallback(
		async (_id: string, bookmark: BookmarkTreeNode) => {
			if (bookmark.url === undefined) {
				return;
			}

			const root = await findExtensionRoot();
			const rootId = root === null ? null : root.id;

			if (rootId === bookmark.parentId) {
				setUncategorizedBookmarks((prevUncategorizedBookmarks) => [
					...prevUncategorizedBookmarks,
					bookmark,
				]);
			} else {
				setBookmarks((prevBookmarks) => [...prevBookmarks, bookmark]);
			}

			await getExtensionTree();
		},
		[getExtensionTree],
	);

	const syncBookmarkMove = useCallback(
		async (id: string, moveInfo: BookmarkMoveInfo) => {
			const item = await browser.bookmarks.get(id);

			if (!item[0]?.url) {
				return;
			}

			if (extensionRoot?.id === moveInfo.parentId) {
				await retrieveExtensionRoot();
			} else {
				await retrieveCategoryBookmarks(moveInfo.parentId);
			}

			await getExtensionTree();
		},
		[extensionRoot?.id, getExtensionTree, retrieveCategoryBookmarks, retrieveExtensionRoot],
	);

	useEffect(() => {
		const handleBookmarkChanges = (id: string, changeInfo: BookmarkChangeInfo) => {
			void syncBookmarkChanges(id, changeInfo);
		};

		const handleBookmarkCreation = (id: string, bookmark: BookmarkTreeNode) => {
			void syncBookmarkCreation(id, bookmark);
		};

		const handleBookmarkDeletion = (id: string, removeInfo: BookmarkRemoveInfo) => {
			void syncBookmarkDeletion(id, removeInfo);
		};

		const handleBookmarkMove = (id: string, moveInfo: BookmarkMoveInfo) => {
			void syncBookmarkMove(id, moveInfo);
		};

		browser.bookmarks.onChanged.addListener(handleBookmarkChanges);
		browser.bookmarks.onCreated.addListener(handleBookmarkCreation);
		browser.bookmarks.onRemoved.addListener(handleBookmarkDeletion);
		browser.bookmarks.onMoved.addListener(handleBookmarkMove);

		return () => {
			browser.bookmarks.onChanged.removeListener(handleBookmarkChanges);
			browser.bookmarks.onCreated.removeListener(handleBookmarkCreation);
			browser.bookmarks.onRemoved.removeListener(handleBookmarkDeletion);
			browser.bookmarks.onMoved.removeListener(handleBookmarkMove);
		};
	}, [bookmarks.length, uncategorizedBookmarks.length]);

	const createBookmark = async ({ name, url, bookmarkCategoryId }: CreateBookmarkValues) => {
		const extensionRootId = await getExtensionRootId();
		const normalizedBookmarkUrl = normalizeBookmarkUrl(url);

		await browser.bookmarks.create({
			parentId: bookmarkCategoryId ?? extensionRootId,
			title: name,
			url: normalizedBookmarkUrl,
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
	}: EditBookmarkValues) => {
		const normalizedBookmarkUrl = normalizeBookmarkUrl(bookmarkUrl);

		await browser.bookmarks.update(id, {
			title: bookmarkName,
			url: normalizedBookmarkUrl,
		});

		if (bookmarkCategoryId) {
			await browser.bookmarks.move(id, {
				parentId: bookmarkCategoryId,
			});
			return;
		}

		const extensionRootId = await getExtensionRootId();
		await browser.bookmarks.move(id, {
			parentId: extensionRootId,
		});
	};

	const removeBookmark = async ({ id }: { id: string }) => {
		const bookmarkDetails = await browser.bookmarks.get(id);
		await browser.bookmarks.removeTree(id);
		const parentId = bookmarkDetails[0]?.parentId;

		if (parentId) {
			await retrieveCategoryBookmarks(parentId);
		}
	};

	const moveBookmark = async (
		id: string,
		fromIndex: number,
		toIndex?: number,
		isUncategorized?: boolean,
	) => {
		if (toIndex === undefined || toIndex < 0 || fromIndex === toIndex) {
			return;
		}

		// Update UI immediately, then persist the new order in browser bookmarks.
		if (isUncategorized) {
			setUncategorizedBookmarks((prevUncategorizedBookmarks) => {
				if (fromIndex < 0 || fromIndex >= prevUncategorizedBookmarks.length) {
					return prevUncategorizedBookmarks;
				}

				const newUncategorizedBookmarks = [...prevUncategorizedBookmarks];
				const [movedBookmark] = newUncategorizedBookmarks.splice(fromIndex, 1);

				newUncategorizedBookmarks.splice(toIndex, 0, movedBookmark);
				return newUncategorizedBookmarks;
			});
		} else {
			setExtensionTree((prevExtensionTree) => {
				if (!prevExtensionTree) {
					return null;
				}

				return prevExtensionTree.map((category) => {
					if (!category.bookmarks.some((bookmark) => bookmark.id === id)) {
						return category;
					}

					if (fromIndex < 0 || fromIndex >= category.bookmarks.length) {
						return category;
					}

					const bookmarks = [...category.bookmarks];
					const [movedBookmark] = bookmarks.splice(fromIndex, 1);

					bookmarks.splice(toIndex, 0, movedBookmark);

					return {
						...category,
						bookmarks,
					};
				});
			});
		}

		const browserBookmarkIndex = fromIndex < toIndex && isChrome() ? toIndex + 1 : toIndex;

		await browser.bookmarks.move(id, {
			index: browserBookmarkIndex,
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
