import { Box, Text } from '@mantine/core';

import { CapsuleSettings } from '@extensionTypes//settingsValues';

import { useBookmarkCapsuleStyles } from './BookmarkCapsule.styles';

type BookmarkCapsuleProps = {
	title: string;
	settings: CapsuleSettings;
	url?: string;
};

export const BookmarkCapsule = ({ title, url, settings }: BookmarkCapsuleProps) => {
	const { classes } = useBookmarkCapsuleStyles({
		size: settings.capsuleSize,
		labelColor: settings.capsuleLabelColor,
	});

	return (
		<Box className={classes.bookmarkCapsuleWrap} component="a" href={url}>
			<Box className={classes.faviconWrap}>
				<img
					src={`https://simplestart-favicon-service.herokuapp.com/icon?url=${url}&size=64`}
					height={settings.capsuleIconSize}
					width={settings.capsuleIconSize}
					alt="website-favicon"
				/>
			</Box>

			{!settings.capsuleHiddenName && (
				<Text
					className={classes.textWrap}
					size={settings.capsuleLabelSize}
					italic={settings.capsuleLabelItalic}
					weight={settings.capsuleLabelBold ? '700' : '400'}
				>
					{title}
				</Text>
			)}
		</Box>
	);
};
