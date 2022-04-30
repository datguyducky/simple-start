import { Box, Button, Group, Select, TextInput } from '@mantine/core';

export const NewBookmarkForm = () => {
	return (
		<Box>
			<TextInput mb="xl" label="Bookmark name" required placeholder="e.g. DuckDuckGo" />
			<TextInput
				mb="xl"
				label="Bookmark url"
				required
				placeholder="e.g. https://duckduckgo.com/"
			/>
			<Select
				label="Select bookmark category"
				data={[]}
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
			/>

			<Group position="right">
				<Button type="submit">Create new bookmark</Button>
			</Group>
		</Box>
	);
};
