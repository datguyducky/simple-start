import { Box, Text, Group } from '@mantine/core';

import { ListSettings } from '@extensionTypes/settingsValues';

import { useBookmarkListRowStyles } from './BookmarkListRow.styles';

type BookmarkListRowProps = {
	title: string;
	settings: ListSettings;
	url?: string;
};

export const BookmarkListRow = ({ title, url, settings }: BookmarkListRowProps) => {
	const { classes } = useBookmarkListRowStyles({
		verticalPadding: settings.listVerticalPadding,
		horizontalPadding: settings.listHorizontalPadding,
	});

	return (
		<Box className={classes.bookmarkListRowWrap} component="a" href={url}>
			<Group spacing={24} position="apart" grow sx={{ width: '100%' }}>
				<Box className={classes.faviconWrap}>
					<img
						src={`https://simplestart-favicon-service.herokuapp.com/icon?url=${url}&size=64`}
						height={settings.listIconSize}
						width={settings.listIconSize}
						style={{ marginRight: 8 }}
					/>

					{!settings.listHiddenName && (
						<Text
							sx={(theme) => ({
								fontSize: settings.listNameSize,
								color: settings.listNameColor ?? theme.colors.text,
							})}
							inline
							weight={settings.listNameBold ? '700' : '400'}
							italic={settings.listNameItalic}
						>
							{title}
						</Text>
					)}
				</Box>

				{!settings.listHiddenUrl && (
					<Text
						sx={(theme) => ({
							fontSize: settings.listUrlSize,
							color: settings.listUrlColor ?? theme.colors.text,
						})}
						inline
						weight={settings.listUrlBold ? '700' : '400'}
						italic={settings.listUrlItalic}
					>
						{url}
					</Text>
				)}
			</Group>
		</Box>
	);
};
