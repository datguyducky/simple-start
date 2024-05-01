import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;
import BookmarkMoveInfo = chrome.bookmarks.BookmarkMoveInfo;
import BookmarkRemoveInfo = chrome.bookmarks.BookmarkRemoveInfo;

import { useExtensionRoot } from '@hooks/useExtensionRoot';

import { useExtensionSettings } from './useExtensionSettings';
import { isChrome } from '../utils/isChrome';

// TODO: It starts to get really messy here, should be refactored a little bit - maybe even categories and bookmarks should be under one file?
export const useExtensionCategories = () => {
	const [categories, setCategories] = useState<BookmarkTreeNode[]>([]);
	const [activeCategory, setActiveCategory] = useState<string | null | undefined>(undefined);
	const { getExtensionTree, setExtensionTree } = useExtensionRoot();

	const { saveExtensionSettings, extensionSettings } = useExtensionSettings();

	const getExtensionCategories = async (rootId: string) => {
		try {
			const extensionCategories = await chrome.bookmarks.getChildren(rootId);
			setCategories(extensionCategories.filter((content) => content?.url === undefined));
		} catch (error) {
			showNotification({
				color: 'red',
				title: 'Categories cannot be found!',
				message: 'Sorry, but something went wrong, please try again.',
				autoClose: 5000,
			});
		}
	};

	// TODO: Just get it from useExtensionRoot hook :)
	const retrieveRootId = async () => {
		const extensionRoot = await chrome.bookmarks.search({ title: 'simplestart' });

		if (extensionRoot?.length && extensionRoot?.length > 0) {
			return extensionRoot[0].id;
		} else {
			// when extension root folder is not found - create it
			const createdRoot = await chrome.bookmarks.create({ title: 'simplestart' });
			return createdRoot.id;
		}
	};

	useEffect(() => {
		//retrieveRoot();
		const categoriesFromRoot = async () => {
			const rootId = await retrieveRootId();

			// it's only possible to retrieve extension categories when the root of the extension exists
			if (rootId) {
				await getExtensionCategories(rootId);
				await getExtensionTree();
			}
		};

		void categoriesFromRoot();
	}, []);

	// making sure that edition of a category (aka bookmark folder) is synced between tabs and views
	const syncCategoryChanges = async () => {
		const rootId = await retrieveRootId();
		await getExtensionCategories(rootId);
		await getExtensionTree();
	};

	// making sure that category (aka bookmark folder) deletion is synced between tabs and views
	const syncCategoryDeletion = async (_id: string, removeInfo: BookmarkRemoveInfo) => {
		if (removeInfo?.node?.url === undefined) {
			const rootId = await retrieveRootId();
			await getExtensionCategories(rootId);
			await getExtensionTree();

			if (removeInfo?.node?.id === activeCategory) {
				setActiveCategory(null);
			}
		}
	};

	const syncCategoryCreation = async (_id: string, category: BookmarkTreeNode) => {
		if (category?.url === undefined) {
			const rootId = await retrieveRootId();
			await getExtensionCategories(rootId);
			await getExtensionTree();
		}
	};

	const syncCategoryMove = async (id: string, _moveInfo: BookmarkMoveInfo) => {
		const category = categories.find((category) => category.id === id);
		if (category?.url === undefined) {
			const rootId = await retrieveRootId();
			await getExtensionCategories(rootId);
			await getExtensionTree();
		}
	};

	useEffect(() => {
		if (categories?.length > 0) {
			chrome.bookmarks.onChanged.addListener(syncCategoryChanges);
			chrome.bookmarks.onCreated.addListener(syncCategoryCreation);
			chrome.bookmarks.onRemoved.addListener(syncCategoryDeletion);
			chrome.bookmarks.onMoved.addListener(syncCategoryMove);
			return () => {
				chrome.bookmarks.onChanged.removeListener(syncCategoryChanges);
				chrome.bookmarks.onCreated.removeListener(syncCategoryCreation);
				chrome.bookmarks.onRemoved.removeListener(syncCategoryDeletion);
				chrome.bookmarks.onMoved.removeListener(syncCategoryMove);
			};
		}
	}, [categories, activeCategory]);

	const createCategory = async ({
		name,
		setAsDefault = false,
	}: {
		name: string;
		setAsDefault?: boolean;
	}) => {
		const rootId = await retrieveRootId();

		const newCategory = await chrome.bookmarks.create({
			parentId: rootId as string,
			title: name,
		});

		if (setAsDefault) {
			await saveExtensionSettings({ defaultCategory: newCategory?.id });
		}
	};

	const editCategory = async ({
		id,
		categoryName,
		defaultCategory,
	}: {
		id: string;
		categoryName: string;
		defaultCategory?: boolean;
	}) => {
		await chrome.bookmarks.update(id, {
			title: categoryName,
		});

		// set category as a default one
		if (defaultCategory) {
			await saveExtensionSettings({ defaultCategory: id });
		} else {
			// if currently edited category is set as default one and got unselected then reset the defaultCategory in storage
			if (extensionSettings?.defaultCategory === id) {
				await saveExtensionSettings({ defaultCategory: '' });
			}
		}
	};

	const removeCategory = async ({ id }: { id: string }) => {
		// before removing category from the extension root folder
		// make sure that the category is also removed from extensionSettings if it's saved there as a defaultCategory
		if (extensionSettings?.defaultCategory === id) {
			await saveExtensionSettings({ defaultCategory: '' });
		}

		await chrome.bookmarks.removeTree(id);
	};

	const moveCategory = async (id: string, fromIndex: number, toIndex?: number) => {
		if (toIndex === undefined || toIndex === null || fromIndex === toIndex) {
			return;
		}

		// This make's that the category is moved without any lag and the changes are visible immediately
		setExtensionTree((prevExtensionTree) => {
			if (prevExtensionTree) {
				const newExtensionTree = [...prevExtensionTree];
				const movedCategory = newExtensionTree.splice(fromIndex, 1)[0];
				newExtensionTree.splice(toIndex, 0, movedCategory);
				return newExtensionTree;
			}
			return null;
		});

		if (fromIndex < toIndex && isChrome()) {
			toIndex++;
		}

		await chrome.bookmarks.move(id, { index: toIndex });
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
