import { Button, Checkbox, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

type NewCategoryFormProps = {
	onClose: () => void;
};

export const NewCategoryForm = ({ onClose }: NewCategoryFormProps) => {
	const { values, setFieldValue, onSubmit } = useForm({
		initialValues: {
			categoryName: '',
			defaultCategory: false,
		},
	});

	const handleCreateCategory = async (formValues: typeof values) => {
		const extensionRootFolder = await browser.bookmarks.search({ title: 'simplestart' });

		try {
			const test = await browser.bookmarks.create({
				parentId: extensionRootFolder[0].id,
				title: formValues.categoryName,
				type: 'folder',
			});
			console.log(test); // todo: toast that the category was created?
		} catch (error) {
			console.error(error);
		}

		onClose(); // hide new category modal
	};

	return (
		<form onSubmit={onSubmit(handleCreateCategory)}>
			<TextInput
				mb="xl"
				label="Category name"
				required
				placeholder="e.g. Home"
				value={values.categoryName}
				onChange={(event) => setFieldValue('categoryName', event.currentTarget.value)}
			/>

			{/* todo: add option to select icons for a category */}

			<Checkbox
				label="Set this category as a default one"
				mb="xl"
				checked={values.defaultCategory}
				onChange={(event) => setFieldValue('defaultCategory', event.currentTarget.checked)}
			/>

			<Group position="right">
				<Button type="submit">Create new category</Button>
			</Group>
		</form>
	);
};
