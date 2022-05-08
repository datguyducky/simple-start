import { useEffect, useState } from 'react';
import { Text, Modal, Box, Select, Grid } from '@mantine/core';
import { ChevronDownIcon } from '@heroicons/react/outline';
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

import { NewBookmarkForm } from '../../forms/NewBookmarkForm';
import { NewCategoryForm } from '../../forms/NewCategoryForm';

import { BookmarkCapsule } from '../../components/BookmarkCapsule';
import { NewTabHeader } from '../../components/NewTabHeader';

export const NewTab = () => {
	const [newBookmarkModal, setNewBookmarkModal] = useState(false);
	const [newCategoryModal, setNewCategoryModal] = useState(false);

	const [categoriesList, setCategoriesList] = useState<BookmarkTreeNode[]>([]);
	const [uncategorizedBookmarks, setUncategorizedBookmarks] = useState<BookmarkTreeNode[]>([]);

	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
	const [bookmarksList, setBookmarksList] = useState<BookmarkTreeNode[]>([]);

	// TODO: re-run this after new bookmark/category was created
	useEffect(() => {
		browser.bookmarks
			.search({ title: 'simplestart' })
			.then((extensionFolder) => {
				if (extensionFolder && extensionFolder?.length > 0) {
					const { id } = extensionFolder[0]; // we just get the first found folder and hope it's the correct one
					browser.bookmarks
						.getChildren(id)
						.then((folderContent) => {
							// save all categories (bookmarks folders)
							setCategoriesList(
								folderContent.filter((content) => content.type === 'folder'),
							);

							// save all bookmarks that are stored in the root of the extension folder
							setUncategorizedBookmarks(
								folderContent.filter((content) => content.type === 'bookmark'),
							);
						})
						.catch((error) => console.error(error));
				}
				// TODO: handle when no folder was found?
			})
			.catch((error) => console.log(error)); // TODO: handle error
	}, []);

	useEffect(() => {
		if (selectedCategoryId) {
			browser.bookmarks
				.getChildren(selectedCategoryId)
				.then((bookmarks) => setBookmarksList(bookmarks))
				.catch((error) => console.error(error));
		}
	}, [selectedCategoryId]);

	return (
		<>
			<Box
				py={32}
				px={96}
				sx={{
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					boxSizing: 'border-box',
				}}
			>
				<NewTabHeader
					onNewBookmarkClick={() => setNewBookmarkModal(true)}
					onNewCategoryClick={() => setNewCategoryModal(true)}
				/>

				<Box>
					{categoriesList?.length < 0 && uncategorizedBookmarks?.length < 0 && (
						<Text color="dimmed">
							Click "add" button to add your first bookmark to this view.
						</Text>
					)}

					<Select
						data={categoriesList.map((category) => ({
							value: category.id,
							label: category.title,
						}))}
						rightSection={<ChevronDownIcon style={{ width: 18, height: 18 }} />}
						variant="unstyled"
						styles={(theme) => ({
							root: {
								width: 156,
								marginBottom: 32,
							},
							input: {
								fontSize: 18,
								fontWeight: 600,
							},
						})}
						allowDeselect
						withinPortal={false}
						value={selectedCategoryId}
						onChange={setSelectedCategoryId}
						placeholder="No category"
					/>

					<Grid columns={12} gutter={48}>
						{bookmarksList?.map((bookmark) => (
							<Grid.Col span={1}>
								<BookmarkCapsule title={bookmark.title} url={bookmark?.url} />
							</Grid.Col>
						))}
					</Grid>
				</Box>
			</Box>

			<Modal
				opened={newBookmarkModal}
				onClose={() => setNewBookmarkModal(false)}
				centered
				title="Add new bookmark"
				size="lg"
				styles={(theme) => ({
					title: {
						fontSize: theme.headings.sizes.h3.fontSize,
						fontWeight: 'bold',
					},
					close: {
						color: theme.colors.red[6],
					},
				})}
			>
				<NewBookmarkForm onClose={() => setNewBookmarkModal(false)} />
			</Modal>

			<Modal
				opened={newCategoryModal}
				onClose={() => setNewCategoryModal(false)}
				centered
				title="Add new category"
				size="lg"
				styles={(theme) => ({
					title: {
						fontSize: theme.headings.sizes.h3.fontSize,
						fontWeight: 'bold',
					},
					close: {
						color: theme.colors.red[6],
					},
				})}
			>
				<NewCategoryForm onClose={() => setNewCategoryModal(false)} />
			</Modal>
		</>
	);
};
