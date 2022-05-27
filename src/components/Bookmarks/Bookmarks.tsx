import { Grid, Stack } from '@mantine/core';
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

import { constants } from '../../common/constants';

import { useExtensionSettings } from '../../hooks/useExtensionSettings';

import { BookmarkCapsule } from '../BookmarkCapsule';
import { BookmarkListRow } from '../BookmarkListRow';

type BookmarksProps = {
	bookmarks: BookmarkTreeNode[];
};

export const Bookmarks = ({ bookmarks }: BookmarksProps) => {
	const { currentView } = useExtensionSettings();

	const currentViewTitle = constants.availableViews.find(
		(view) => view.id === currentView,
	)?.title;

	if (currentViewTitle === 'Capsules') {
		return (
			<Grid columns={12} gutter={48}>
				{bookmarks.map((bookmark) => (
					<Grid.Col span={1} key={bookmark.id}>
						<BookmarkCapsule title={bookmark.title} url={bookmark?.url} />
					</Grid.Col>
				))}
			</Grid>
		);
	}

	if (currentViewTitle === 'List') {
		return (
			<Stack
				justify="flex-start"
				spacing={4}
				sx={{
					'& > a:first-of-type': {
						borderTopLeftRadius: 5,
						borderTopRightRadius: 5,
					},
					'& > a:last-of-type': {
						borderBottomLeftRadius: 5,
						borderBottomRightRadius: 5,
					},
				}}
			>
				{bookmarks.map((bookmark) => (
					<BookmarkListRow key={bookmark.id} title={bookmark.title} url={bookmark.url} />
				))}
			</Stack>
		);
	}

	return <></>;
};
