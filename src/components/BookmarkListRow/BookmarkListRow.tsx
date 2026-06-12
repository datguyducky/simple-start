import { Box, Text, Group } from '@mantine/core';

import { ListSettings } from '@/types/settingsValues';

import classes from './BookmarkListRow.module.css';
import { FAVICONS_API_URL } from '@/common/constants.tsx';

type BookmarkListRowProps = {
	title: string;
	settings: ListSettings;
	isOdd: boolean;
	url?: string;
};

export const BookmarkListRow = ({ title, url, isOdd, settings }: BookmarkListRowProps) => {
	const cleanedUrl = url ? new URL(url).hostname : '';
	const perfectIconSize = Math.max(settings.listIconSize || 0, 8).toString();
	const maxIconSize = ((settings.listIconSize || 0) + 40).toString();

	return (
		<Box
			className={classes.bookmarkListRowWrap}
			component="a"
			href={url}
			style={{
				'--settings-vertical-padding': settings.listVerticalPadding,
				'--settings-horizontal-padding': settings.listHorizontalPadding,
			}}
			mod={{ 'is-odd': isOdd, 'use-stripped-rows': settings.listUseStrippedRows }}
		>
			<Group gap={24} align="center" style={{ width: '100%' }}>
				<Box className={classes.faviconWrap} flex={1}>
					<img
						src={`${FAVICONS_API_URL}/icon?url=${cleanedUrl}&size=8..${perfectIconSize}..${maxIconSize}`}
						height={settings.listIconSize}
						width={settings.listIconSize}
						style={{ marginRight: 8 }}
						alt=""
					/>

					{!settings.listHiddenName && (
						<Text
							lh={1}
							fw={settings.listNameBold ? '700' : '400'}
							fs={settings.listNameItalic ? 'italic' : undefined}
							c={settings.listNameColor ?? 'var(--mantine-color-text)'}
							fz={settings.listNameSize}
							mt={4} // without the text looks a little bit misaligned compared to image/rest of the div
						>
							{title}
						</Text>
					)}
				</Box>

				{!settings.listHiddenUrl && (
					<Text
						lh={1}
						fw={settings.listUrlBold ? '700' : '400'}
						fs={settings.listUrlItalic ? 'italic' : undefined}
						fz={settings.listUrlSize}
						c={settings.listUrlColor ?? 'var(--mantine-color-text)'}
						flex={1}
						mt={4} // without the text looks a little bit misaligned compared to image/rest of the div
					>
						{url}
					</Text>
				)}
			</Group>
		</Box>
	);
};
