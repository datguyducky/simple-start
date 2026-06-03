import { Box, Text } from '@mantine/core';

import { type CapsuleSettings } from '@/types/settingsValues';

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

	const cleanedUrl = url ? new URL(url).hostname : '';
	const perfectIconSize = Math.max(settings.capsuleIconSize, 8).toString();
	const maxIconSize = (settings.capsuleIconSize + 40).toString();

	return (
		<Box className={classes.bookmarkCapsuleWrap} component="a" href={url}>
			<Box className={classes.faviconWrap}>
				<img
					src={`https://simple-start-api.fly.dev/icon?url=${cleanedUrl}&size=8..${perfectIconSize}..${maxIconSize}`}
					height={settings.capsuleIconSize}
					width={settings.capsuleIconSize}
					alt=""
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
