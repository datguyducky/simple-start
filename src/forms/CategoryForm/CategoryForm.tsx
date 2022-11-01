import { Button, Checkbox, Group, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { categorySchema } from '../../validation/categorySchema';

export type CategoryValues = {
	id: string;
	categoryName: string;
	defaultCategory?: boolean;
};

type CategoryFormProps = {
	onClose: () => void;
	mode: 'edit' | 'create';
	createNewCategory?: ({
		name,
		setAsDefault,
	}: {
		name: string;
		setAsDefault?: boolean;
	}) => Promise<void>;
	editCategory?: ({ id, categoryName, defaultCategory }: CategoryValues) => Promise<void>;
	initialValues?: CategoryValues;
};

export const CategoryForm = ({
	onClose,
	mode,
	createNewCategory,
	editCategory,
	initialValues,
}: CategoryFormProps) => {
	const { values, onSubmit, getInputProps } = useForm({
		initialValues: initialValues ?? {
			categoryName: '',
			defaultCategory: false,
		},
		validate: zodResolver(categorySchema),
	});

	const handleCreateCategory = (formValues: typeof values) => {
		if (createNewCategory) {
			setTimeout(async () => {
				try {
					await createNewCategory({
						name: formValues.categoryName,
						setAsDefault: formValues.defaultCategory,
					});

					showNotification({
						color: 'dark',
						message: `The ${formValues.categoryName} category was successfully created!`,
						autoClose: 3000,
					});
				} catch (error) {
					showNotification({
						color: 'red',
						title: 'A new category can not be created!',
						message: 'Sorry, but something went wrong, please try again.',
						autoClose: 5000,
					});
				}
			}, 500);
			onClose(); // hide modal
		}
	};

	const handleEditCategory = (formValues: typeof values) => {
		if (editCategory && initialValues) {
			setTimeout(async () => {
				try {
					await editCategory({
						id: initialValues.id,
						categoryName: formValues.categoryName,
						defaultCategory: formValues.defaultCategory,
					});

					showNotification({
						color: 'dark',
						message: `The ${formValues.categoryName} category was successfully edited!`,
						autoClose: 3000,
					});
				} catch (error) {
					showNotification({
						color: 'red',
						title: 'This category can not be edited!',
						message: 'Sorry, but something went wrong, please try again.',
						autoClose: 5000,
					});
				}
			}, 500);
			onClose(); // hide modal
		}
	};

	console.log(values);
	return (
		<form
			onSubmit={onSubmit(mode === 'create' ? handleCreateCategory : handleEditCategory)}
			noValidate
		>
			<TextInput
				mb="xl"
				label="Category name"
				required
				placeholder="e.g. Home"
				{...getInputProps('categoryName')}
			/>

			<Checkbox
				label="Set this category as a default one"
				mb="xl"
				{...getInputProps('defaultCategory', { type: 'checkbox' })}
			/>

			<Group position="right">
				<Button type="submit">
					{mode === 'create' ? 'Create new category' : 'Save changes'}
				</Button>
			</Group>
		</form>
	);
};
