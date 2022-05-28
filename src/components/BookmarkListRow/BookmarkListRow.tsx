import { Box, Text, Group } from '@mantine/core';

import { useBookmarkListRowStyles } from './BookmarkListRow.styles';

type BookmarkListRowProps = {
	title: string;
	url?: string;
};

export const BookmarkListRow = ({ title, url }: BookmarkListRowProps) => {
	const { classes } = useBookmarkListRowStyles();

	return (
		<Box className={classes.bookmarkListRowWrap} component="a" href={url}>
			<Group spacing={24} position="apart" grow sx={{ width: '100%' }}>
				<Box className={classes.faviconWrap}>
					<img
						src={`https://simplestart-favicon-service.herokuapp.com/icon?url=${url}&size=64`}
						height={24}
						width={24}
						style={{ marginRight: 8 }}
					/>

					<Text
						sx={{
							fontSize: 16,
						}}
						inline
					>
						{title}
					</Text>
				</Box>

				<Text
					sx={{
						fontSize: 14,
					}}
					inline
				>
					{url}
				</Text>
			</Group>
		</Box>
	);
};
