import { Box, Text } from '@mantine/core';

import { useBookmarkCapsuleStyles } from './BookmarkCapsule.styles';

type BookmarkCapsuleProps = {
	title: string;
	url?: string;
};

export const BookmarkCapsule = ({ title, url }: BookmarkCapsuleProps) => {
	const { classes } = useBookmarkCapsuleStyles();

	return (
		<Box className={classes.bookmarkCapsuleWrap} component="a" href={url}>
			<Box className={classes.faviconWrap}>
				<img
					src={`https://simplestart-favicon-service.herokuapp.com/icon?url=${url}&size=64`}
					height={32}
					width={32}
				/>
			</Box>

			<Text className={classes.textWrap}>{title}</Text>
		</Box>
	);
};
