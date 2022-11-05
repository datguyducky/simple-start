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
			width: size + 44,

			[`&:hover .${getRef('faviconWrapRef')}`]: {
				backgroundColor: theme.colors.background[2],
			},
		},

		faviconWrap: {
			ref: getRef('faviconWrapRef'),

			marginBottom: 8,
			height: size,
			width: size,
			backgroundColor: theme.colors.background[1],
			boxSizing: 'border-box',
			borderRadius: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			boxShadow: 'inset 0px 4px 8px rgba(0, 0, 0, 0.05)',
		},

		textWrap: {
			textOverflow: 'ellipsis',
			overflow: 'hidden',
			whiteSpace: 'nowrap',
			maxWidth: size + 44,
			width: '100%',
			color: labelColor ?? theme.colors.text,
		},
	}),
);
