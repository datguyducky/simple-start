import { createStyles } from '@mantine/core';

export const useNewTabHeaderStyles = createStyles((theme) => ({
	headerButton: {
		color: theme.colors.text,

		'&:hover': {
			backgroundColor: theme.colors.background[2],
		},
	},
	menuDropdown: {
		backgroundColor: theme.colors.background[0],
		borderColor: theme.colors.background[2],
	},
	menuArrow: {
		borderColor: theme.colors.background[2],
	},
}));
