import { Box, Text } from '@mantine/core';

type BookmarkCapsuleProps = {
	title: string;
	url?: string;
};

export const BookmarkCapsule = ({ title, url }: BookmarkCapsuleProps) => {
	return (
		<Box
			sx={(theme) => ({
				textAlign: 'center',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				cursor: 'pointer',
				color: 'black',
				textDecoration: 'none',
				maxWidth: 120,

				'&:hover div:first-of-type': {
					backgroundColor: theme.colors.gray[2],
				},
			})}
			component="a"
			href={url}
		>
			<Box
				sx={{
					marginBottom: 8,
					height: 64,
					width: 64,
					padding: 16,
					backgroundColor: '#F3F3F3',
					boxSizing: 'border-box',
					borderRadius: '100%',
					boxShadow: 'inset 0px 4px 8px rgba(0, 0, 0, 0.05)',
				}}
			>
				<img
					src={`https://simplestart-favicon-service.herokuapp.com/icon?url=${url}&size=64`}
					height={32}
					width={32}
				/>
			</Box>

			<Text
				sx={{
					textOverflow: 'ellipsis',
					overflow: 'hidden',
					whiteSpace: 'nowrap',
					maxWidth: 120,
					fontSize: 14,
				}}
			>
				{title}
			</Text>
		</Box>
	);
};
