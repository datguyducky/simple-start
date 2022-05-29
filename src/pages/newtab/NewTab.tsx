import { useEffect, useState } from 'react';
import { Text, Modal, Box, Select } from '@mantine/core';
import { ChevronDownIcon } from '@heroicons/react/outline';

import { NewBookmarkForm } from '../../forms/NewBookmarkForm';
import { CategoryForm } from '../../forms/CategoryForm';

import { Bookmarks } from '../../components/Bookmarks';
import { NewTabHeader } from '../../components/NewTabHeader';

import { useExtensionBookmarks } from '../../hooks/useExtensionBookmarks';
import { useExtensionCategories } from '../../hooks/useExtensionCategories';
import { useExtensionSettings } from '../../hooks/useExtensionSettings';

import { useNewTabStyles } from './NewTab.styles';

export const NewTab = () => {
	const [newBookmarkModal, setNewBookmarkModal] = useState(false);
	const [newCategoryModal, setNewCategoryModal] = useState(false);

	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

	const { bookmarks, uncategorizedBookmarks, createBookmark } = useExtensionBookmarks({
		categoryId: selectedCategoryId,
	});
	const { categories, createCategory } = useExtensionCategories();

	const { classes } = useNewTabStyles({
		width:
			(categories?.find((category) => category.id === selectedCategoryId)?.title?.length ||
				11) *
				8 +
			64,
	});

	const { extensionSettings } = useExtensionSettings();

	useEffect(() => {
		if (extensionSettings?.defaultCategory && !selectedCategoryId) {
			setSelectedCategoryId(extensionSettings.defaultCategory);
		}
	}, [extensionSettings, selectedCategoryId]);

	return (
		<>
			<Box className={classes.newTabLayout}>
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
						classNames={{
							root: classes.selectRoot,
							input: classes.selectInput,
							dropdown: classes.selectDropdown,
						}}
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
				) : categories.length > 0 ? (
					<Text>
						Sorry, the currently selected category doesn't have any bookmarks. Click
						"add" button to create a new bookmark or category.
					</Text>
				) : (
					<></>
				)}
			</Box>

			<Modal
				opened={newBookmarkModal}
				onClose={() => setNewBookmarkModal(false)}
				centered
				title="Add new bookmark"
				size="lg"
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
			>
				<CategoryForm
					mode="create"
					onClose={() => setNewCategoryModal(false)}
					createNewCategory={createCategory}
				/>
			</Modal>
		</>
	);
};
