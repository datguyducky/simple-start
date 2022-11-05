import { createStyles } from '@mantine/core';

type BookmarkListRowStylesProps = {
	verticalPadding: number;
	horizontalPadding: number;
};

export const useBookmarkListRowStyles = createStyles(
	(theme, { verticalPadding, horizontalPadding }: BookmarkListRowStylesProps) => ({
		bookmarkListRowWrap: {
			display: 'flex',
			cursor: 'pointer',
			color: 'black',
			textDecoration: 'none',
			alignItems: 'center',
			padding: `${verticalPadding}px ${horizontalPadding}px`,
			backgroundColor: theme.colors.background[1],

			'&:hover': {
				backgroundColor: theme.colors.background[2],
			},
		},

		faviconWrap: {
			display: 'flex',
			alignItems: 'center',
		},
	}),
);
