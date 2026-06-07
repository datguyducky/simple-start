import { Button, Checkbox, Group, TextInput } from '@mantine/core';
import { useForm, schemaResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { handleAsyncAction } from '@/utils/handleAsyncAction';
import { wait } from '@/utils/wait';
import { categorySchema } from '@/validation/categorySchema';

export type CategoryValues = {
	id: string;
	categoryName: string;
	defaultCategory?: boolean;
};

type CategoryFormValues = Omit<CategoryValues, 'id'>;

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
	const { onSubmit, getInputProps, isValid, isDirty } = useForm<CategoryFormValues>({
		initialValues: initialValues ?? {
			categoryName: '',
			defaultCategory: false,
		},
		validate: schemaResolver(categorySchema),
	});

	const handleCreateCategory = (formValues: CategoryFormValues) => {
		if (!createNewCategory) {
			return;
		}

		onClose();

		handleAsyncAction(
			async () => {
				await wait(500);
				await createNewCategory({
					name: formValues.categoryName,
					setAsDefault: formValues.defaultCategory,
				});

				notifications.show({
					color: 'dark',
					message: `The ${formValues.categoryName} category was successfully created!`,
					autoClose: 3000,
				});
			},
			{
				errorTitle: 'A new category can not be created!',
			},
		);
	};

	const handleEditCategory = (formValues: CategoryFormValues) => {
		if (!editCategory || !initialValues) {
			return;
		}

		onClose();

		handleAsyncAction(
			async () => {
				await wait(500);
				await editCategory({
					id: initialValues.id,
					categoryName: formValues.categoryName,
					defaultCategory: formValues.defaultCategory,
				});

				notifications.show({
					color: 'dark',
					message: `The ${formValues.categoryName} category was successfully edited!`,
					autoClose: 3000,
				});
			},
			{
				errorTitle: 'This category can not be edited!',
			},
		);
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
				{...getInputProps('categoryName')}
			/>

			<Checkbox
				label="Set this category as a default one"
				mb="xl"
				{...getInputProps('defaultCategory', { type: 'checkbox' })}
			/>

			<Group justify="flex-end">
				<Button type="submit" disabled={!isValid() || !isDirty()}>
					{mode === 'create' ? 'Create new category' : 'Save changes'}
				</Button>
			</Group>
		</form>
	);
};
