import { Box, Button, Checkbox, Group, TextInput } from '@mantine/core';

export const NewCategoryForm = () => {
	return (
		<Box>
			<TextInput mb="xl" label="Category name" required placeholder="e.g. Home" />

			{/* todo: add option to select icons for a category */}

			<Checkbox label="Set this category as a default one" mb="xl" />

			<Group position="right">
				<Button type="submit">Create new category</Button>
			</Group>
		</Box>
	);
};
