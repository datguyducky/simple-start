import { createStyles } from '@mantine/core';

export const useBookmarkListRowStyles = createStyles((theme) => ({
	bookmarkListRowWrap: {
		display: 'flex',
		cursor: 'pointer',
		color: 'black',
		textDecoration: 'none',
		alignItems: 'center',
		padding: '12px 20px',
		backgroundColor: '#F3F3F3',

		'&:hover': {
			backgroundColor: theme.colors.gray[2],
		},
	},

	faviconWrap: {
		display: 'flex',
		alignItems: 'center',
	},
}));
