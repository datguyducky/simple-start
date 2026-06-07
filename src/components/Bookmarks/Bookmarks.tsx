import { Stack, Group } from '@mantine/core';

import { constants } from '@/common/constants';
import { BookmarkCapsule } from '@/components/BookmarkCapsule';
import { BookmarkListRow } from '@/components/BookmarkListRow';
import { useExtensionSettings } from '@/hooks/useExtensionSettings';
import { BookmarkTreeNode } from '@/types/browserExtend';

import classes from './Bookmarks.module.css';

type BookmarksProps = {
	bookmarks: BookmarkTreeNode[];
};

export const Bookmarks = ({ bookmarks }: BookmarksProps) => {
	const { currentView, extensionSettings } = useExtensionSettings();

	const currentViewTitle = constants.availableViews.find(
		(view) => view.id === currentView,
	)?.title;

	if (currentViewTitle === 'Capsules') {
		return (
			<Group gap={extensionSettings.capsuleSpacing}>
				{bookmarks.map((bookmark) => (
					<BookmarkCapsule
						key={bookmark.id}
						title={bookmark.title}
						url={bookmark.url}
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
				gap={extensionSettings.listSpacing}
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
