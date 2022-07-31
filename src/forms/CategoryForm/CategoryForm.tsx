import { Button, Checkbox, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';

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
	const { values, errors, setFieldValue, onSubmit } = useForm({
		initialValues: initialValues ?? {
			categoryName: '',
			defaultCategory: false,
		},
		validate: (values) => ({
			categoryName: values.categoryName.length <= 0 ? 'Category name is required' : null,
		}),
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
				value={values.categoryName}
				error={errors.categoryName}
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
				<Button type="submit">
					{mode === 'create' ? 'Create new category' : 'Save changes'}
				</Button>
			</Group>
		</form>
	);
};
