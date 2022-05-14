import { Button, Group, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

import { useExtensionCategories } from '../../hooks/useExtensionCategories';

type NewBookmarkFormProps = {
	onClose: () => void;
	createNewBookmark: ({
		name,
		url,
		bookmarkCategoryId,
	}: {
		name: string;
		url: string;
		bookmarkCategoryId?: string;
	}) => Promise<void>;
};

export const NewBookmarkForm = ({ onClose, createNewBookmark }: NewBookmarkFormProps) => {
	const { values, setFieldValue, onSubmit } = useForm({
		initialValues: {
			bookmarkName: '',
			bookmarkUrl: '',
			bookmarkCategory: '',
		},
	});

	const { categories } = useExtensionCategories();

	// todo: this currently rejects bookmarks urls without https and http - display error or add http at the beginning?
	const handleCreateNewBookmark = (formValues: typeof values) => {
		// todo: toast that the bookmark was created?
		setTimeout(async () => {
			await createNewBookmark({
				name: formValues.bookmarkName,
				url: formValues.bookmarkUrl,
				bookmarkCategoryId:
					formValues.bookmarkCategory.length > 0
						? formValues.bookmarkCategory
						: undefined,
			});
		}, 600);

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
				data={categories.map((category) => ({
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
