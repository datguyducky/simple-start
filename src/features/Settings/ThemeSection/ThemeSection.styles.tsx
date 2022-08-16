import { createStyles } from '@mantine/core';

export const useThemeSectionStyles = createStyles((theme) => ({
	colorBox: {
		width: 64,
		height: 64,
		borderRadius: theme.radius.sm,
		border: '1px solid transparent',
		cursor: 'pointer',
	},

	light: {
		backgroundColor: '#ffffff',
		borderColor: '#e9ecef',

		'&:hover': {
			backgroundColor: '#e9ecef',
		},
	},

	dark: {
		backgroundColor: '#181818',
		borderColor: '#464646',

		'&:hover': {
			backgroundColor: '#464646',
		},
	},

	custom: {
		backgroundColor: 'red',
	},

	active: {
		borderColor: theme.colors[theme.primaryColor],
	},
}));
