import { Grid, Stack } from '@mantine/core';
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

import { constants } from '../../common/constants';

import { useExtensionSettings } from '../../hooks/useExtensionSettings';

import { BookmarkCapsule } from '../BookmarkCapsule';
import { BookmarkListRow } from '../BookmarkListRow';

import { useBookmarksStyles } from './Bookmarks.styles';

type BookmarksProps = {
	bookmarks: BookmarkTreeNode[];
};

export const Bookmarks = ({ bookmarks }: BookmarksProps) => {
	const { classes } = useBookmarksStyles();

	const { currentView } = useExtensionSettings();

	const currentViewTitle = constants.availableViews.find(
		(view) => view.id === currentView,
	)?.title;

	if (currentViewTitle === 'Capsules') {
		return (
			<Grid columns={12} gutter={16}>
				{bookmarks.map((bookmark) => (
					<Grid.Col xl={1} lg={2} md={2} sm={3} xs={4} key={bookmark.id}>
						<BookmarkCapsule title={bookmark.title} url={bookmark?.url} />
					</Grid.Col>
				))}
			</Grid>
		);
	}

	if (currentViewTitle === 'List') {
		return (
			<Stack justify="flex-start" spacing={4} className={classes.bookmarksListWrap}>
				{bookmarks.map((bookmark) => (
					<BookmarkListRow key={bookmark.id} title={bookmark.title} url={bookmark.url} />
				))}
			</Stack>
		);
	}

	return <></>;
};
