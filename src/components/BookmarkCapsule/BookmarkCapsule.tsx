import { Box, Text } from '@mantine/core';

import { useBookmarkCapsuleStyles } from './BookmarkCapsule.styles';
import { useExtensionSettings } from '../../hooks/useExtensionSettings';

type BookmarkCapsuleProps = {
	title: string;
	url?: string;
};

export const BookmarkCapsule = ({ title, url }: BookmarkCapsuleProps) => {
	const { extensionSettings } = useExtensionSettings();
	const { classes } = useBookmarkCapsuleStyles({
		size: extensionSettings.capsuleSize,
		labelColor: extensionSettings.capsuleLabelColor,
	});

	return (
		<Box className={classes.bookmarkCapsuleWrap} component="a" href={url}>
			<Box className={classes.faviconWrap}>
				<img
					src={`https://simplestart-favicon-service.herokuapp.com/icon?url=${url}&size=64`}
					height={extensionSettings.capsuleIconSize}
					width={extensionSettings.capsuleIconSize}
				/>
			</Box>

			{!extensionSettings.capsuleHiddenName && (
				<Text
					className={classes.textWrap}
					size={extensionSettings.capsuleLabelSize}
					italic={extensionSettings.capsuleLabelItalic}
					weight={extensionSettings.capsuleLabelBold ? '700' : '400'}
				>
					{title}
				</Text>
			)}
		</Box>
	);
};
