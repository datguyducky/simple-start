import { Box, Text } from '@mantine/core';

type BookmarkCapsuleProps = {
	title: string;
	url?: string;
};

export const BookmarkCapsule = ({ title, url }: BookmarkCapsuleProps) => {
	return (
		<Box>
			<Text>{title}</Text>
		</Box>
	);
};
