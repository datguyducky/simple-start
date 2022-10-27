import { createStyles } from '@mantine/core';

interface BookmarkCapsuleStylesProps {
	size: number;
	labelColor: string | null;
}

export const useBookmarkCapsuleStyles = createStyles(
	(theme, { size, labelColor }: BookmarkCapsuleStylesProps, getRef) => ({
		bookmarkCapsuleWrap: {
			textAlign: 'center',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			cursor: 'pointer',
			color: theme.colors.text,
			textDecoration: 'none',
			width: size,

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
			maxWidth: size,
			width: '100%',
			color: labelColor ?? theme.colors.text,
		},
	}),
);
