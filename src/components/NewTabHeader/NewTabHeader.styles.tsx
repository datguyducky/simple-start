import { createStyles } from '@mantine/core';

export const useNewTabHeaderStyles = createStyles((theme) => ({
	headerButton: {
		'&:hover': {
			backgroundColor: theme.colors.gray[2],
		},
	},
}));
