import { createStyles } from '@mantine/core';

export const useNewTabStyles = createStyles((theme, { width }: { width: number }) => ({
	newTabLayout: {
		minHeight: '100vh',
		display: 'flex',
		flexDirection: 'column',
		boxSizing: 'border-box',
		padding: '32px 96px',

		[`@media (max-width: ${theme.breakpoints.xl}px)`]: {
			padding: '32px 64px',
		},

		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			padding: '32px 48px',
		},

		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			padding: '32px 24px',
		},
	},

	// styles for Category Select component
	selectRoot: {
		marginBottom: 32,
		maxWidth: '100%',
		marginLeft: -8,
		width: width,
		position: 'relative',
	},
	selectInput: {
		fontSize: 18,
		fontWeight: 600,
		paddingLeft: 8,
		borderRadius: 5,
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		whiteSpace: 'nowrap',

		'&:hover': {
			backgroundColor: theme.colors.gray[2],
		},
	},
	selectDropdown: {
		minWidth: '210px !important',
		maxWidth: '210px !important',
		left: '0px !important',
	},
}));
