import { Box, Text, Group } from '@mantine/core';

type BookmarkListRowProps = {
	title: string;
	url?: string;
};

export const BookmarkListRow = ({ title, url }: BookmarkListRowProps) => {
	return (
		<Box
			sx={(theme) => ({
				display: 'flex',
				cursor: 'pointer',
				color: 'black',
				textDecoration: 'none',
				alignItems: 'center',
				padding: '12px 20px',
				backgroundColor: '#F3F3F3',

				'&:hover': {
					backgroundColor: theme.colors.gray[2],
				},
			})}
			component="a"
			href={url}
		>
			<Group spacing={24} position="apart" grow sx={{ width: '100%' }}>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
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
