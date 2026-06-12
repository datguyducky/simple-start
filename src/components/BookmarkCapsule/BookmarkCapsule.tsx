import { Box, Text } from '@mantine/core';

import { type CapsuleSettings } from '@/types/settingsValues';

import classes from './BookmarkCapsule.module.css';
import { FAVICONS_API_URL } from '@/common/constants.tsx';

type BookmarkCapsuleProps = {
	title: string;
	settings: CapsuleSettings;
	url?: string;
};

export const BookmarkCapsule = ({ title, url, settings }: BookmarkCapsuleProps) => {
	const cleanedUrl = url ? new URL(url).hostname : '';
	const perfectIconSize = Math.max(settings.capsuleIconSize || 0, 8).toString();
	const maxIconSize = ((settings.capsuleIconSize || 0) + 40).toString();

	return (
		<Box
			className={classes.bookmarkCapsuleWrap}
			component="a"
			href={url}
			style={{
				'--settings-capsule-size': settings.capsuleSize,
			}}
			c={settings.capsuleLabelColor ?? 'var(--mantine-color-text)'}
		>
			<Box
				className={`${classes.faviconWrap} ${settings.capsuleIsHeart ? classes.faviconWrapHeart : ''}`}
			>
				<img
					src={`${FAVICONS_API_URL}/icon?url=${cleanedUrl}&size=8..${perfectIconSize}..${maxIconSize}`}
					height={settings.capsuleIconSize}
					width={settings.capsuleIconSize}
					alt=""
				/>
			</Box>

			{!settings.capsuleHiddenName && (
				<Text
					className={classes.capsuleLabel}
					fs={settings.capsuleLabelItalic ? 'italic' : undefined}
					fw={settings.capsuleLabelBold ? '700' : '400'}
					fz={settings.capsuleLabelSize}
				>
					{title}
				</Text>
			)}
		</Box>
	);
};
