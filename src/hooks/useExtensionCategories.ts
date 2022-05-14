import { useEffect, useState } from 'react';
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

export const useExtensionCategories = () => {
	const [categories, setCategories] = useState<BookmarkTreeNode[]>([]);

	const getExtensionCategories = async (rootId: string) => {
		try {
			const extensionCategories = await browser.bookmarks.getChildren(rootId);
			setCategories(extensionCategories.filter((content) => content.type === 'folder'));
		} catch (error) {
			console.log(error); //todo: handle error
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

	const createCategory = async ({ name }: { name: string }) => {
		const extensionRootFolder = await browser.bookmarks.search({ title: 'simplestart' });

		try {
			await browser.bookmarks.create({
				parentId: extensionRootFolder[0].id,
				title: name,
				type: 'folder',
			});
			await getExtensionCategories(extensionRootFolder[0].id);
		} catch (error) {
			console.error(error); //todo: handle error
		}
	};

	return {
		categories,
		createCategory,
	};
};
