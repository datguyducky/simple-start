import { Button, Group, Select, Text, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';

import { useExtensionCategories } from '@hooks/useExtensionCategories';

import { bookmarkSchema } from '@validation/bookmarkSchema';

export type BookmarkValues = {
	id: string;
	bookmarkName: string;
	bookmarkUrl: string;
	bookmarkCategoryId?: string;
};

type BookmarkFormProps = {
	onClose: () => void;
	mode: 'edit' | 'create';
	createNewBookmark?: ({
		name,
		url,
		bookmarkCategoryId,
	}: {
		name: string;
		url: string;
		bookmarkCategoryId?: string;
	}) => Promise<void>;
	editBookmark?: ({
		id,
		bookmarkName,
		bookmarkCategoryId,
		bookmarkUrl,
	}: BookmarkValues) => Promise<void>;
	initialValues?: BookmarkValues;
	onEditBookmark?: () => void;
};

export const BookmarkForm = ({
	mode,
	onClose,
	createNewBookmark,
	editBookmark,
	onEditBookmark,
	initialValues,
}: BookmarkFormProps) => {
	const { values, onSubmit, getInputProps, isValid } = useForm({
		initialValues: initialValues ?? {
			bookmarkName: '',
			bookmarkUrl: '',
			bookmarkCategoryId: '',
		},
		validate: zodResolver(bookmarkSchema),
	});

	const { categories } = useExtensionCategories();

	const handleCreateNewBookmark = (formValues: typeof values) => {
		if (createNewBookmark) {
			const categoryName = categories.find(
				(category) => category.id === formValues.bookmarkCategoryId,
			)?.title;

			setTimeout(async () => {
				try {
					await createNewBookmark({
						name: formValues.bookmarkName,
						url: formValues.bookmarkUrl,
						bookmarkCategoryId: categoryName
							? formValues.bookmarkCategoryId
							: undefined,
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
		}
	};

	const handleEditBookmark = (formValues: typeof values) => {
		if (editBookmark && initialValues) {
			setTimeout(async () => {
				try {
					await editBookmark({
						id: initialValues.id,
						bookmarkName: formValues.bookmarkName,
						bookmarkUrl: formValues.bookmarkUrl,
						bookmarkCategoryId: formValues?.bookmarkCategoryId,
					});

					onEditBookmark && onEditBookmark();

					showNotification({
						color: 'dark',
						message: `The ${formValues.bookmarkName} bookmark was successfully edited!`,
						autoClose: 3000,
					});
				} catch (error) {
					showNotification({
						color: 'red',
						title: 'This bookmark can not be edited!',
						message: 'Sorry, but something went wrong, please try again.',
						autoClose: 5000,
					});
				}
			}, 500);
			onClose(); // hide modal
		}
	};

	return (
		<form
			onSubmit={onSubmit(mode === 'create' ? handleCreateNewBookmark : handleEditBookmark)}
			noValidate
		>
			<TextInput
				mb="xl"
				label="Bookmark name"
				required
				placeholder="e.g. DuckDuckGo"
				{...getInputProps('bookmarkName')}
			/>
			<TextInput
				mb="xl"
				label="Bookmark url"
				required
				placeholder="e.g. https://duckduckgo.com/"
				{...getInputProps('bookmarkUrl')}
			/>

			{categories.length > 0 ? (
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
					{...getInputProps('bookmarkCategoryId')}
				/>
			) : (
				<>
					<Text size="sm">Select bookmark category</Text>
					<Text size="xs" color="dimmed" weight={600} mb="xl">
						To select category you first need to create it in the New Category modal
					</Text>
				</>
			)}

			<Group position="right">
				<Button type="submit" disabled={!isValid()}>
					{mode === 'create' ? 'Create new bookmark' : 'Save changes'}
				</Button>
			</Group>
		</form>
	);
};
