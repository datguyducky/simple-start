import { Button, Checkbox, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';

type NewCategoryFormProps = {
	onClose: () => void;
	createNewCategory: ({
		name,
		setAsDefault,
	}: {
		name: string;
		setAsDefault?: boolean;
	}) => Promise<void>;
};

export const NewCategoryForm = ({ onClose, createNewCategory }: NewCategoryFormProps) => {
	const { values, errors, setFieldValue, onSubmit } = useForm({
		initialValues: {
			categoryName: '',
			defaultCategory: false,
		},
		validate: (values) => ({
			categoryName: values.categoryName.length <= 0 ? 'Category name is required' : null,
		}),
	});

	const handleCreateCategory = (formValues: typeof values) => {
		// todo: toast that the category was created?
		setTimeout(async () => {
			try {
				await createNewCategory({
					name: formValues.categoryName,
					setAsDefault: values.defaultCategory,
				});

				showNotification({
					color: 'dark',
					message: `The ${formValues.categoryName} category was successfully created!`,
					autoClose: 3000,
				});
			} catch (error) {
				showNotification({
					color: 'red',
					title: 'A new category could not be created!',
					message: 'Sorry, but something went wrong, please try again.',
					autoClose: 5000,
				});
			}
		}, 500);
		onClose(); // hide modal
	};

	return (
		<form onSubmit={onSubmit(handleCreateCategory)} noValidate>
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
				<Button type="submit">Create new category</Button>
			</Group>
		</form>
	);
};
