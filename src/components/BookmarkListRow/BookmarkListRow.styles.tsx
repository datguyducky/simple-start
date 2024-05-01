import { createStyles } from '@mantine/core';

type BookmarkListRowStylesProps = {
	verticalPadding: number;
	horizontalPadding: number;
	useStrippedRows: boolean;
	isOdd: boolean;
};

export const useBookmarkListRowStyles = createStyles(
	(
		theme,
		{ verticalPadding, horizontalPadding, useStrippedRows, isOdd }: BookmarkListRowStylesProps,
	) => ({
		bookmarkListRowWrap: {
			display: 'flex',
			cursor: 'pointer',
			color: 'black',
			textDecoration: 'none',
			alignItems: 'center',
			padding: `${verticalPadding}px ${horizontalPadding}px`,
			backgroundColor: useStrippedRows
				? isOdd
					? theme.colors.background[1]
					: theme.colors.background[0]
				: theme.colors.background[1],

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
