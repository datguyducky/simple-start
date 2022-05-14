import { Button, Group, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';

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
		const categoryName = categories.find(
			(category) => category.id === formValues.bookmarkCategory,
		)?.title;

		setTimeout(async () => {
			try {
				await createNewBookmark({
					name: formValues.bookmarkName,
					url: formValues.bookmarkUrl,
					bookmarkCategoryId: categoryName ? formValues.bookmarkCategory : undefined,
				});

				showNotification({
					color: 'dark',
					title: categoryName
						? 'Bookmark was successfully added!'
						: `The ${formValues.bookmarkName} bookmark was successfully added!`,
					message: categoryName
						? `The ${formValues.bookmarkName} bookmark was added to the ${categoryName} category.`
						: undefined,
					autoClose: 3000,
				});
			} catch (error) {
				showNotification({
					color: 'red',
					title: 'A new bookmark could not be created!',
					message: 'Sorry, but something went wrong, please try again.',
					autoClose: 5000,
				});
			}
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
