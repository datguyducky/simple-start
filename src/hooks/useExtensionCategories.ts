import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

import _OnChangedChangeInfo = browser.bookmarks._OnChangedChangeInfo;
import _OnRemovedRemoveInfo = browser.bookmarks._OnRemovedRemoveInfo;

import { useExtensionSettings } from './useExtensionSettings';

export const useExtensionCategories = () => {
	const [categories, setCategories] = useState<BookmarkTreeNode[]>([]);
	const [activeCategory, setActiveCategory] = useState<string | null | undefined>(undefined);

	const { saveExtensionSettings, extensionSettings } = useExtensionSettings();

	const getExtensionCategories = async (rootId: string) => {
		try {
			const extensionCategories = await browser.bookmarks.getChildren(rootId);
			setCategories(extensionCategories.filter((content) => content.type === 'folder'));
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
		const extensionRoot = await browser.bookmarks.search({ title: 'simplestart' });
		return extensionRoot[0].id;
	};

	useEffect(() => {
		//retrieveRoot();
		const categoriesFromRoot = async () => {
			const rootId = await retrieveRootId();
			await getExtensionCategories(rootId);
		};

		categoriesFromRoot();
	}, []);

	// making sure that edition of a category (aka bookmark folder) is synced between tabs and views
	const syncCategoryChanges = (id: string, changeInfo: _OnChangedChangeInfo) => {
		const updatedCategories = categories.map((category) =>
			category.id === id ? { ...category, ...changeInfo } : category,
		);

		setCategories(updatedCategories);
	};

	// making sure that category (aka bookmark folder) deletion is synced between tabs and views
	const syncCategoryDeletion = (id: string, removeInfo: _OnRemovedRemoveInfo) => {
		if (removeInfo?.node?.type === 'folder') {
			const cleanedCategories = categories.filter((category) => category.id !== id);

			setCategories(cleanedCategories);

			if (removeInfo?.node?.id === activeCategory) {
				setActiveCategory(null);
			}
		}
	};

	useEffect(() => {
		if (categories?.length > 0) {
			browser.bookmarks.onChanged.addListener(syncCategoryChanges);
			browser.bookmarks.onRemoved.addListener(syncCategoryDeletion);
			return () => {
				browser.bookmarks.onChanged.removeListener(syncCategoryChanges);
				browser.bookmarks.onRemoved.removeListener(syncCategoryDeletion);
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

		const newCategory = await browser.bookmarks.create({
			parentId: rootId,
			title: name,
			type: 'folder',
		});

		if (setAsDefault) {
			await saveExtensionSettings({ defaultCategory: newCategory?.id });
		}

		await getExtensionCategories(rootId);
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
		await browser.bookmarks.update(id, {
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
		await getExtensionCategories(rootId);
	};

	const removeCategory = async ({ id }: { id: string }) => {
		// before removing category from the extension root folder
		// make sure that the category is also removed from extensionSettings if it's saved there as a defaultCategory
		if (extensionSettings?.defaultCategory === id) {
			await saveExtensionSettings({ defaultCategory: '' });
		}

		await browser.bookmarks.removeTree(id);

		// retrieve updated list of extension categories
		const rootId = await retrieveRootId();
		await getExtensionCategories(rootId);
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
