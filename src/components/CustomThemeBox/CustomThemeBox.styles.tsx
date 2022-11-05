import { createStyles } from '@mantine/core';

interface CustomThemeBoxStylesProps {
	backgroundColor: string;
	borderColor: string;
}

export const useCustomThemeBoxStyles = createStyles(
	(theme, { backgroundColor, borderColor }: CustomThemeBoxStylesProps, getRef) => ({
		customThemeBox: {
			width: 64,
			height: 64,
			borderRadius: theme.radius.sm,
			border: '1px solid transparent',
			cursor: 'pointer',
			position: 'relative',
			borderColor: borderColor,
			backgroundColor: backgroundColor,

			'&:hover': {
				backgroundColor: borderColor,
			},

			[`&:hover .${getRef('removeAction')}`]: {
				display: 'flex',
			},

			[`&:hover .${getRef('editAction')}`]: {
				display: 'flex',
			},
		},
		
		absoluteWrapper: {
			position: 'absolute',
			top: 0,
			right: 0,
			marginTop: 1,
			marginRight: 1,
		},

		active: {
			borderColor: theme.colors[theme.primaryColor][6],
		},

		removeAction: {
			ref: getRef('removeAction'),
			display: 'none',

			'&:hover': {
				backgroundColor: theme.colors.red[9],
			},
		},

		editAction: {
			ref: getRef('editAction'),
			display: 'none',

			'&:hover': {
				backgroundColor: theme.colors.blue[9],
			},
		},
	}),
);
