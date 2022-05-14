import { Button, Checkbox, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

type NewCategoryFormProps = {
	onClose: () => void;
	createNewCategory: ({ name }: { name: string }) => Promise<void>;
};

export const NewCategoryForm = ({ onClose, createNewCategory }: NewCategoryFormProps) => {
	const { values, setFieldValue, onSubmit } = useForm({
		initialValues: {
			categoryName: '',
			defaultCategory: false,
		},
	});

	const handleCreateCategory = (formValues: typeof values) => {
		// todo: toast that the category was created?
		setTimeout(async () => {
			await createNewCategory({ name: formValues.categoryName });
		}, 600);
		onClose(); // hide modal
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
