import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

import { useExtensionSettings } from './useExtensionSettings';

export const useExtensionCategories = () => {
	const [categories, setCategories] = useState<BookmarkTreeNode[]>([]);
	const { handleSetDefaultCategory, extensionSettings } = useExtensionSettings();

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
			await handleSetDefaultCategory({ newDefaultCategory: newCategory?.id });
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
			await handleSetDefaultCategory({ newDefaultCategory: id });
		} else {
			// if currently edited category is set as default one and got unselected then reset the defaultCategory in storage
			if (extensionSettings?.defaultCategory === id) {
				await handleSetDefaultCategory({ newDefaultCategory: '' });
			}
		}

		const rootId = await retrieveRootId();
		await getExtensionCategories(rootId);
	};

	const removeCategory = async ({ id }: { id: string }) => {
		// before removing category from the extension root folder
		// make sure that the category is also removed from extensionSettings if it's saved there as a defaultCategory
		if (extensionSettings?.defaultCategory === id) {
			await handleSetDefaultCategory({ newDefaultCategory: '' });
		}

		await browser.bookmarks.removeTree(id);

		const rootId = await retrieveRootId();
		await getExtensionCategories(rootId);
	};

	return {
		categories,
		createCategory,
		editCategory,
		removeCategory,
	};
};
