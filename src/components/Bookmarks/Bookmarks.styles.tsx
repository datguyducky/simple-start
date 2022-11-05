import { createStyles } from '@mantine/core';

export const useBookmarksStyles = createStyles({
	bookmarksListWrap: {
		'& > a:first-of-type': {
			borderTopLeftRadius: 5,
			borderTopRightRadius: 5,
		},
		'& > a:last-of-type': {
			borderBottomLeftRadius: 5,
			borderBottomRightRadius: 5,
		},
	},
});
