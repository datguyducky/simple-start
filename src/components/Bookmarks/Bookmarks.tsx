import { Stack, Group } from '@mantine/core';
import BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

import { constants } from '@common/constants';

import { useExtensionSettings } from '@hooks/useExtensionSettings';

import { BookmarkCapsule } from '../BookmarkCapsule';
import { BookmarkListRow } from '../BookmarkListRow';

import { useBookmarksStyles } from './Bookmarks.styles';

type BookmarksProps = {
	bookmarks: BookmarkTreeNode[];
};

export const Bookmarks = ({ bookmarks }: BookmarksProps) => {
	const { classes } = useBookmarksStyles();

	const { currentView, extensionSettings } = useExtensionSettings();

	const currentViewTitle = constants.availableViews.find(
		(view) => view.id === currentView,
	)?.title;

	if (currentViewTitle === 'Capsules') {
		return (
			<Group spacing={extensionSettings.capsuleSpacing}>
				{bookmarks.map((bookmark) => (
					<BookmarkCapsule
						key={bookmark.id}
						title={bookmark.title}
						url={bookmark?.url}
						settings={extensionSettings}
					/>
				))}
			</Group>
		);
	}

	if (currentViewTitle === 'List') {
		return (
			<Stack
				justify="flex-start"
				spacing={extensionSettings.listSpacing}
				className={classes.bookmarksListWrap}
			>
				{bookmarks.map((bookmark, index) => (
					<BookmarkListRow
						key={bookmark.id}
						title={bookmark.title}
						url={bookmark.url}
						settings={extensionSettings}
						isOdd={index % 2 === 0}
					/>
				))}
			</Stack>
		);
	}

	return <></>;
};
