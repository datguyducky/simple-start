import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

import { useExtensionSettings } from './useExtensionSettings';

export const useExtensionCategories = () => {
	const [categories, setCategories] = useState<BookmarkTreeNode[]>([]);
	const { handleSetDefaultCategory } = useExtensionSettings();

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

	useEffect(() => {
		const retrieveRoot = async () => {
			const extensionRoot = await browser.bookmarks.search({ title: 'simplestart' });
			if (extensionRoot?.length) {
				await getExtensionCategories(extensionRoot[0].id);
			}
		};

		retrieveRoot();
	}, []);

	const createCategory = async ({
		name,
		setAsDefault = false,
	}: {
		name: string;
		setAsDefault?: boolean;
	}) => {
		const extensionRootFolder = await browser.bookmarks.search({ title: 'simplestart' });

		const newCategory = await browser.bookmarks.create({
			parentId: extensionRootFolder[0].id,
			title: name,
			type: 'folder',
		});

		if (setAsDefault) {
			await handleSetDefaultCategory({ newDefaultCategory: newCategory?.id });
		}

		await getExtensionCategories(extensionRootFolder[0].id);
	};

	return {
		categories,
		createCategory,
	};
};
