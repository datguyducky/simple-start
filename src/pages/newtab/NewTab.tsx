import { useEffect, useState } from 'react';
import { Button, Grid, Group, Menu, Text, Title, Modal, Box, Select } from '@mantine/core';
import {
	CogIcon,
	PlusIcon,
	BookmarkIcon,
	CollectionIcon,
	ChevronDownIcon,
} from '@heroicons/react/outline';

import { NewBookmarkForm } from '../../forms/NewBookmarkForm';
import { NewCategoryForm } from '../../forms/NewCategoryForm';
import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
import { BookmarkCapsule } from '../../components/BookmarkCapsule';

export const NewTab = () => {
	const [newBookmarkModal, setNewBookmarkModal] = useState(false);
	const [newCategoryModal, setNewCategoryModal] = useState(false);

	const [categoriesList, setCategoriesList] = useState<BookmarkTreeNode[]>([]);
	const [uncategorizedBookmarks, setUncategorizedBookmarks] = useState<BookmarkTreeNode[]>([]);

	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
	const [bookmarksList, setBookmarksList] = useState<BookmarkTreeNode[]>([]);

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
			<Box py={32} px={96}>
				<Grid columns={3} style={{ marginBottom: 32 }}>
					<Grid.Col span={1}>
						<Title>Simple Start</Title>
					</Grid.Col>

					<Grid.Col span={1} offset={1}>
						<Group position="right" spacing="xs">
							<Menu
								control={
									<Button
										variant="subtle"
										leftIcon={<PlusIcon style={{ width: 14, height: 14 }} />}
										compact
										color="dark"
										sx={(theme) => ({
											'&:hover': {
												backgroundColor: theme.colors.gray[2],
											},
										})}
									>
										Add
									</Button>
								}
								withArrow
							>
								<Menu.Item
									icon={<BookmarkIcon style={{ width: 14, height: 14 }} />}
									sx={(theme) => ({
										'&:hover': {
											backgroundColor: theme.colors.gray[2],
										},
									})}
									onClick={() => setNewBookmarkModal(true)}
								>
									New Bookmark
								</Menu.Item>
								<Menu.Item
									icon={<CollectionIcon style={{ width: 14, height: 14 }} />}
									sx={(theme) => ({
										'&:hover': {
											backgroundColor: theme.colors.gray[2],
										},
									})}
									onClick={() => setNewCategoryModal(true)}
								>
									New Category
								</Menu.Item>
							</Menu>

							<Button
								variant="subtle"
								leftIcon={<CogIcon style={{ width: 14, height: 14 }} />}
								compact
								color="dark"
								sx={(theme) => ({
									'&:hover': {
										backgroundColor: theme.colors.gray[2],
									},
								})}
								onClick={async () =>
									await browser.runtime
										.openOptionsPage()
										.then(() => console.log('did work?'))
										.catch((error) => console.error(error))
								}
							>
								Settings
							</Button>
						</Group>
					</Grid.Col>
				</Grid>

				<div>
					{categoriesList?.length < 0 && uncategorizedBookmarks?.length < 0 && (
						<Text color="dimmed">
							Click "add" button to add your first bookmark to this view.
						</Text>
					)}

					<Select
						data={categoriesList.map((category) => ({
							...category,
							value: category.id,
							label: category.title,
						}))}
						rightSection={<ChevronDownIcon style={{ width: 18, height: 18 }} />}
						variant="unstyled"
						styles={(theme) => ({
							root: {
								maxWidth: 120,
							},
							dropdown: {
								backgroundColor: 'transparent',
								padding: 0,
								//border: 'none',
								//boxShadow: 'none',
							},
							item: {
								padding: 0,
								backgroundColor: 'transparent',
							},
							input: {
								fontSize: 18,
								fontWeight: 600,
							},
						})}
						allowDeselect
						initiallyOpened
						withinPortal={false}
						value={selectedCategoryId}
						onChange={setSelectedCategoryId}
						//dropdownComponent={<div></div>}
					/>
				</div>

				{bookmarksList?.map((bookmark) => (
					<BookmarkCapsule title={bookmark.title} url={bookmark?.url} />
				))}
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
				<NewBookmarkForm />
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
				<NewCategoryForm />
			</Modal>
		</>
	);
};
