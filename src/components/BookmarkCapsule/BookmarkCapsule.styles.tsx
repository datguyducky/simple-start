import { createStyles } from '@mantine/core';

export const useBookmarkCapsuleStyles = createStyles((theme, _params, getRef) => ({
	bookmarkCapsuleWrap: {
		textAlign: 'center',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		cursor: 'pointer',
		color: theme.colors.text,
		textDecoration: 'none',

		[`&:hover .${getRef('faviconWrapRef')}`]: {
			backgroundColor: theme.colors.background[2],
		},
	},

	faviconWrap: {
		ref: getRef('faviconWrapRef'),

		marginBottom: 8,
		height: 64,
		width: 64,
		padding: 16,
		backgroundColor: theme.colors.background[1],
		boxSizing: 'border-box',
		borderRadius: '100%',
		boxShadow: 'inset 0px 4px 8px rgba(0, 0, 0, 0.05)',
	},

	textWrap: {
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		maxWidth: 120,
		fontSize: 14,
		width: '100%',
	},
}));
