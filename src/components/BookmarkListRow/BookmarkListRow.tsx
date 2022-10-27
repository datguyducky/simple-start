import { Box, Text, Group } from '@mantine/core';

import { useBookmarkListRowStyles } from './BookmarkListRow.styles';
import { useExtensionSettings } from '../../hooks/useExtensionSettings';

type BookmarkListRowProps = {
	title: string;
	url?: string;
};

export const BookmarkListRow = ({ title, url }: BookmarkListRowProps) => {
	const { extensionSettings } = useExtensionSettings();
	const { classes } = useBookmarkListRowStyles({
		verticalPadding: extensionSettings.listVerticalPadding,
		horizontalPadding: extensionSettings.listHorizontalPadding,
	});

	return (
		<Box className={classes.bookmarkListRowWrap} component="a" href={url}>
			<Group spacing={24} position="apart" grow sx={{ width: '100%' }}>
				<Box className={classes.faviconWrap}>
					<img
						src={`https://simplestart-favicon-service.herokuapp.com/icon?url=${url}&size=64`}
						height={extensionSettings.listIconSize}
						width={extensionSettings.listIconSize}
						style={{ marginRight: 8 }}
					/>

					{!extensionSettings.listHiddenName && (
						<Text
							sx={(theme) => ({
								fontSize: extensionSettings.listNameSize,
								color: extensionSettings.listNameColor ?? theme.colors.text,
							})}
							inline
							weight={extensionSettings.listNameBold ? '700' : '400'}
							italic={extensionSettings.listNameItalic}
						>
							{title}
						</Text>
					)}
				</Box>

				{!extensionSettings.listHiddenUrl && (
					<Text
						sx={(theme) => ({
							fontSize: extensionSettings.listUrlSize,
							color: extensionSettings.listUrlColor ?? theme.colors.text,
						})}
						inline
						weight={extensionSettings.listUrlBold ? '700' : '400'}
						italic={extensionSettings.listUrlItalic}
					>
						{url}
					</Text>
				)}
			</Group>
		</Box>
	);
};
