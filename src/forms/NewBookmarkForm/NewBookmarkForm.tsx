import { Button, Group, Select, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import { useForm } from '@mantine/form';

type NewBookmarkFormProps = {
	onClose: () => void;
};

export const NewBookmarkForm = ({ onClose }: NewBookmarkFormProps) => {
	const [categoriesList, setCategoriesList] = useState<BookmarkTreeNode[]>([]);

	const { values, setFieldValue, onSubmit } = useForm({
		initialValues: {
			bookmarkName: '',
			bookmarkUrl: '',
			bookmarkCategory: '',
		},
	});

	useEffect(() => {
		browser.bookmarks
			.search({ title: 'simplestart' })
			.then((extensionFolder) => {
				if (extensionFolder && extensionFolder?.length > 0) {
					const { id } = extensionFolder[0]; // we just get the first found folder and hope it's the correct one
					browser.bookmarks
						.getChildren(id)
						.then((folderContent) => {
							// save all categories (bookmarks folders)
							setCategoriesList(
								folderContent.filter((content) => content.type === 'folder'),
							);
						})
						.catch((error) => console.error(error));
				}
			})
			.catch((error) => console.log(error));
	}, []);

	// todo: this currently rejects bookmarks urls without https and http - display error or add http at the beginning?
	const handleCreateNewBookmark = async (formValues: typeof values) => {
		const extensionRootFolder = await browser.bookmarks.search({ title: 'simplestart' });

		try {
			const test = await browser.bookmarks.create({
				parentId:
					formValues.bookmarkCategory.length > 0
						? formValues.bookmarkCategory
						: extensionRootFolder[0].id,
				title: formValues.bookmarkName,
				url: formValues.bookmarkUrl,
				type: 'bookmark',
			});
			console.log(test); // todo: toast that the bookmark was created?
		} catch (error) {
			console.error(error);
		}

		onClose(); // close modal with the form
	};

	return (
		<form onSubmit={onSubmit(handleCreateNewBookmark)}>
			<TextInput
				mb="xl"
				label="Bookmark name"
				required
				placeholder="e.g. DuckDuckGo"
				value={values.bookmarkName}
				onChange={(event) => setFieldValue('bookmarkName', event.currentTarget.value)}
			/>
			<TextInput
				mb="xl"
				label="Bookmark url"
				required
				placeholder="e.g. https://duckduckgo.com/"
				value={values.bookmarkUrl}
				onChange={(event) => setFieldValue('bookmarkUrl', event.currentTarget.value)}
			/>
			<Select
				label="Select bookmark category"
				data={categoriesList.map((category) => ({
					value: category.id,
					label: category.title,
				}))}
				searchable
				nothingFound="Category not found"
				clearable
				mb="xl"
				styles={(theme) => ({
					hovered: {
						backgroundColor: theme.colors.gray[2],
						color: theme.colors.dark[9],
					},
					selected: {
						backgroundColor: theme.colors.gray[2],
						color: theme.colors.dark[9],
					},
				})}
				value={values.bookmarkCategory}
				onChange={(category) => setFieldValue('bookmarkCategory', category || '')}
			/>

			<Group position="right">
				<Button type="submit">Create new bookmark</Button>
			</Group>
		</form>
	);
};
