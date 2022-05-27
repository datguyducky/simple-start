import { useEffect, useState } from 'react';
import { Text, Modal, Box, Select } from '@mantine/core';
import { ChevronDownIcon } from '@heroicons/react/outline';

import { NewBookmarkForm } from '../../forms/NewBookmarkForm';
import { NewCategoryForm } from '../../forms/NewCategoryForm';

import { Bookmarks } from '../../components/Bookmarks';
import { NewTabHeader } from '../../components/NewTabHeader';

import { useExtensionBookmarks } from '../../hooks/useExtensionBookmarks';
import { useExtensionCategories } from '../../hooks/useExtensionCategories';
import { useExtensionSettings } from '../../hooks/useExtensionSettings';

export const NewTab = () => {
	const [newBookmarkModal, setNewBookmarkModal] = useState(false);
	const [newCategoryModal, setNewCategoryModal] = useState(false);

	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

	const { bookmarks, uncategorizedBookmarks, createBookmark } = useExtensionBookmarks({
		categoryId: selectedCategoryId,
	});
	const { categories, createCategory } = useExtensionCategories();

	const { extensionSettings } = useExtensionSettings();

	useEffect(() => {
		if (extensionSettings?.defaultCategory && !selectedCategoryId) {
			setSelectedCategoryId(extensionSettings.defaultCategory);
		}
	}, [extensionSettings, selectedCategoryId]);

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

				{categories?.length <= 0 && uncategorizedBookmarks?.length <= 0 ? (
					<Text color="dimmed">
						Click "add" button to add your first bookmark and category to this view.
					</Text>
				) : (
					<Select
						data={categories.map((category) => ({
							value: category.id,
							label: category.title,
						}))}
						rightSection={<ChevronDownIcon style={{ width: 18, height: 18 }} />}
						variant="unstyled"
						styles={(theme) => ({
							root: {
								marginBottom: 32,
								width:
									(categories?.find(
										(category) => category.id === selectedCategoryId,
									)?.title?.length || 11) *
										8 +
									64,
								maxWidth: '100%',
								marginLeft: -8,
							},
							input: {
								fontSize: 18,
								fontWeight: 600,
								paddingLeft: 8,
								borderRadius: 5,
								textOverflow: 'ellipsis',
								overflow: 'hidden',
								whiteSpace: 'nowrap',
								paddingRight: 32,

								'&:hover': {
									backgroundColor: theme.colors.gray[2],
								},
							},
							dropdown: {
								width: '210px !important',
								minWidth: '210px !important',
							},
							hovered: {
								backgroundColor: theme.colors.gray[2],
								color: theme.colors.dark[9],
							},
							selected: {
								backgroundColor: theme.colors.gray[2],
								color: theme.colors.dark[9],
							},
						})}
						allowDeselect
						withinPortal={false}
						value={selectedCategoryId}
						onChange={setSelectedCategoryId}
						placeholder="No category"
					/>
				)}

				{(selectedCategoryId && bookmarks.length > 0) ||
				(!selectedCategoryId && uncategorizedBookmarks?.length > 0) ? (
					<Bookmarks
						bookmarks={selectedCategoryId ? bookmarks : uncategorizedBookmarks}
					/>
				) : (
					<Text>
						Sorry, the currently selected category doesn't have any bookmarks. Click
						"add" button to create a new bookmark or category.
					</Text>
				)}
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
				<NewBookmarkForm
					onClose={() => setNewBookmarkModal(false)}
					createNewBookmark={createBookmark}
				/>
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
				<NewCategoryForm
					onClose={() => setNewCategoryModal(false)}
					createNewCategory={createCategory}
				/>
			</Modal>
		</>
	);
};
