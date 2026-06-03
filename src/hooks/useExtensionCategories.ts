import { useCallback, useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { browser } from 'wxt/browser';

import {
	type BookmarkMoveInfo,
	type BookmarkRemoveInfo,
	type BookmarkTreeNode,
} from '@/types/browserExtend';

import { useExtensionSettings } from './useExtensionSettings';
import { isChrome } from '../utils/isChrome';
import { useExtensionRoot } from './useExtensionRoot';
import { getExtensionRootId } from '@/utils/extensionRoot';

type CreateCategoryValues = {
	name: string;
	setAsDefault?: boolean;
};

type EditCategoryValues = {
	id: string;
	categoryName: string;
	defaultCategory?: boolean;
};

export const useExtensionCategories = () => {
	const [categories, setCategories] = useState<BookmarkTreeNode[]>([]);
	const [activeCategory, setActiveCategory] = useState<string | null | undefined>(undefined);
	const { getExtensionTree, setExtensionTree } = useExtensionRoot();

	const { saveExtensionSettings, extensionSettings } = useExtensionSettings();

	const getExtensionCategories = useCallback(async (rootId: string) => {
		try {
			const extensionCategories = await browser.bookmarks.getChildren(rootId);
			setCategories(extensionCategories.filter((content) => content.url === undefined));
		} catch (_error) {
			showNotification({
				color: 'red',
				title: 'Categories cannot be found!',
				message: 'Sorry, but something went wrong, please try again.',
				autoClose: 5000,
			});
		}
	}, []);

	const retrieveRootId = useCallback(async () => {
		return getExtensionRootId();
	}, []);

	const syncCategories = useCallback(async () => {
		const rootId = await retrieveRootId();

		await getExtensionCategories(rootId);
		await getExtensionTree();
	}, [getExtensionCategories, getExtensionTree, retrieveRootId]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		void syncCategories();
	}, []);

	const syncCategoryChanges = useCallback(async () => {
		await syncCategories();
	}, [syncCategories]);

	const syncCategoryDeletion = useCallback(
		async (_id: string, removeInfo: BookmarkRemoveInfo) => {
			if (removeInfo.node.url !== undefined) {
				return;
			}

			await syncCategories();

			if (removeInfo.node.id === activeCategory) {
				setActiveCategory(null);
			}
		},
		[activeCategory, syncCategories],
	);

	const syncCategoryCreation = useCallback(
		async (_id: string, category: BookmarkTreeNode) => {
			if (category.url !== undefined) {
				return;
			}

			await syncCategories();
		},
		[syncCategories],
	);

	const syncCategoryMove = useCallback(
		async (id: string, _moveInfo: BookmarkMoveInfo) => {
			const movedCategory = categories.find((category) => category.id === id);

			if (movedCategory?.url !== undefined) {
				return;
			}

			await syncCategories();
		},
		[categories, syncCategories],
	);

	useEffect(() => {
		const handleCategoryChanges = () => {
			void syncCategoryChanges();
		};

		const handleCategoryCreation = (id: string, category: BookmarkTreeNode) => {
			void syncCategoryCreation(id, category);
		};

		const handleCategoryDeletion = (id: string, removeInfo: BookmarkRemoveInfo) => {
			void syncCategoryDeletion(id, removeInfo);
		};

		const handleCategoryMove = (id: string, moveInfo: BookmarkMoveInfo) => {
			void syncCategoryMove(id, moveInfo);
		};

		browser.bookmarks.onChanged.addListener(handleCategoryChanges);
		browser.bookmarks.onCreated.addListener(handleCategoryCreation);
		browser.bookmarks.onRemoved.addListener(handleCategoryDeletion);
		browser.bookmarks.onMoved.addListener(handleCategoryMove);

		return () => {
			browser.bookmarks.onChanged.removeListener(handleCategoryChanges);
			browser.bookmarks.onCreated.removeListener(handleCategoryCreation);
			browser.bookmarks.onRemoved.removeListener(handleCategoryDeletion);
			browser.bookmarks.onMoved.removeListener(handleCategoryMove);
		};
	}, []);

	const createCategory = async ({ name, setAsDefault = false }: CreateCategoryValues) => {
		const rootId = await retrieveRootId();

		const newCategory = await browser.bookmarks.create({
			parentId: rootId,
			title: name,
		});

		if (setAsDefault) {
			await saveExtensionSettings({ defaultCategory: newCategory.id });
		}
	};

	const editCategory = async ({ id, categoryName, defaultCategory }: EditCategoryValues) => {
		await browser.bookmarks.update(id, {
			title: categoryName,
		});

		// Set category as a default one.
		if (defaultCategory) {
			await saveExtensionSettings({ defaultCategory: id });
			return;
		}

		// If edited category was default and got unselected, reset default category.
		if (extensionSettings.defaultCategory === id) {
			await saveExtensionSettings({ defaultCategory: '' });
		}
	};

	const removeCategory = async ({ id }: { id: string }) => {
		// Before removing category, make sure it is also removed from extension settings
		// if it is currently saved as default category.
		if (extensionSettings.defaultCategory === id) {
			await saveExtensionSettings({ defaultCategory: '' });
		}

		await browser.bookmarks.removeTree(id);
	};

	const moveCategory = async (id: string, fromIndex: number, toIndex?: number) => {
		if (toIndex === undefined || fromIndex === toIndex) {
			return;
		}

		// Update UI immediately, then persist the new order in browser bookmarks.
		setExtensionTree((prevExtensionTree) => {
			if (!prevExtensionTree) {
				return null;
			}

			if (fromIndex < 0 || fromIndex >= prevExtensionTree.length) {
				return prevExtensionTree;
			}

			const newExtensionTree = [...prevExtensionTree];
			const [movedCategory] = newExtensionTree.splice(fromIndex, 1);

			newExtensionTree.splice(toIndex, 0, movedCategory);
			return newExtensionTree;
		});

		const browserCategoryIndex = fromIndex < toIndex && isChrome() ? toIndex + 1 : toIndex;

		await browser.bookmarks.move(id, { index: browserCategoryIndex });
	};

	return {
		activeCategory,
		setActiveCategory,
		categories,
		createCategory,
		editCategory,
		removeCategory,
		moveCategory,
	};
};
