import { Box, Text, Group } from '@mantine/core';

import { ListSettings } from '@/types/settingsValues';

import { useBookmarkListRowStyles } from './BookmarkListRow.styles';

type BookmarkListRowProps = {
	title: string;
	settings: ListSettings;
	isOdd: boolean;
	url?: string;
};

export const BookmarkListRow = ({ title, url, isOdd, settings }: BookmarkListRowProps) => {
	const { classes } = useBookmarkListRowStyles({
		verticalPadding: settings.listVerticalPadding,
		horizontalPadding: settings.listHorizontalPadding,
		isOdd,
		useStrippedRows: settings.listUseStrippedRows,
	});

	const cleanedUrl = url ? new URL(url).hostname : '';
	const perfectIconSize = Math.max(settings.listIconSize, 8).toString();
	const maxIconSize = (settings.listIconSize + 40).toString();

	return (
		<Box className={classes.bookmarkListRowWrap} component="a" href={url}>
			<Group spacing={24} position="apart" grow sx={{ width: '100%' }}>
				<Box className={classes.faviconWrap}>
					<img
						src={`https://simple-start-api.fly.dev/icon?url=${cleanedUrl}&size=8..${perfectIconSize}..${maxIconSize}`}
						height={settings.listIconSize}
						width={settings.listIconSize}
						style={{ marginRight: 8 }}
						alt=""
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
