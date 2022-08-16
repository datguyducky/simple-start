import { createStyles } from '@mantine/core';

export const useBookmarkListRowStyles = createStyles((theme) => ({
	bookmarkListRowWrap: {
		display: 'flex',
		cursor: 'pointer',
		color: 'black',
		textDecoration: 'none',
		alignItems: 'center',
		padding: '12px 20px',
		backgroundColor: theme.colors.background[1],

		'&:hover': {
			backgroundColor: theme.colors.background[2],
		},
	},

	faviconWrap: {
		display: 'flex',
		alignItems: 'center',
	},
}));
