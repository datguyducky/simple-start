import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

import { useExtensionSettings } from './useExtensionSettings';
import BookmarkChangeInfo = chrome.bookmarks.BookmarkChangeInfo;
import BookmarkRemoveInfo = chrome.bookmarks.BookmarkRemoveInfo;

export const useExtensionCategories = () => {
	const [categories, setCategories] = useState<BookmarkTreeNode[]>([]);
	const [activeCategory, setActiveCategory] = useState<string | null | undefined>(undefined);

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

	const retrieveRootId = async () => {
		const extensionRoot = await chrome.bookmarks.search({ title: 'simplestart' });

		if (extensionRoot?.length && extensionRoot?.length > 0) {
			return extensionRoot[0].id;
		} else {
			// when extension root folder is not found - create it
			await chrome.bookmarks.create({ title: 'simplestart' });
		}
	};

	useEffect(() => {
		//retrieveRoot();
		const categoriesFromRoot = async () => {
			const rootId = await retrieveRootId();

			// it's only possible to retrieve extension categories when the root of the extension exists
			if (rootId) {
				await getExtensionCategories(rootId);
			}
		};

		void categoriesFromRoot();
	}, []);

	// making sure that edition of a category (aka bookmark folder) is synced between tabs and views
	const syncCategoryChanges = (id: string, changeInfo: BookmarkChangeInfo) => {
		const updatedCategories = categories.map((category) =>
			category.id === id ? { ...category, ...changeInfo } : category,
		);

		setCategories(updatedCategories);
	};

	// making sure that category (aka bookmark folder) deletion is synced between tabs and views
	const syncCategoryDeletion = (id: string, removeInfo: BookmarkRemoveInfo) => {
		if (removeInfo?.node?.url === 'undefined') {
			const cleanedCategories = categories.filter((category) => category.id !== id);

			setCategories(cleanedCategories);

			if (removeInfo?.node?.id === activeCategory) {
				setActiveCategory(null);
			}
		}
	};

	useEffect(() => {
		if (categories?.length > 0) {
			chrome.bookmarks.onChanged.addListener(syncCategoryChanges);
			chrome.bookmarks.onRemoved.addListener(syncCategoryDeletion);
			return () => {
				chrome.bookmarks.onChanged.removeListener(syncCategoryChanges);
				chrome.bookmarks.onRemoved.removeListener(syncCategoryDeletion);
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

		await getExtensionCategories(rootId as string);
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

		const rootId = await retrieveRootId();
		await getExtensionCategories(rootId as string);
	};

	const removeCategory = async ({ id }: { id: string }) => {
		// before removing category from the extension root folder
		// make sure that the category is also removed from extensionSettings if it's saved there as a defaultCategory
		if (extensionSettings?.defaultCategory === id) {
			await saveExtensionSettings({ defaultCategory: '' });
		}

		await chrome.bookmarks.removeTree(id);

		// retrieve updated list of extension categories
		const rootId = await retrieveRootId();
		await getExtensionCategories(rootId as string);
	};

	return {
		activeCategory,
		setActiveCategory,
		categories,
		createCategory,
		editCategory,
		removeCategory,
	};
};
