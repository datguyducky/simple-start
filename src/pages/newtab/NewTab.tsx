import { useEffect, useState } from 'react';
import { Text, Modal, Box, Select } from '@mantine/core';
import { ChevronDownIcon } from '@heroicons/react/outline';

import { BookmarkForm } from '../../forms/BookmarkForm';
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

	const { activeCategory, setActiveCategory, categories, createCategory } =
		useExtensionCategories();

	const { bookmarks, uncategorizedBookmarks, createBookmark } = useExtensionBookmarks({
		categoryId: activeCategory,
	});

	// todo: for sure this width handle needs rework as in some cases is way to big (long text + calculation makes it bigger than the whole page/monitor)
	const { classes } = useNewTabStyles({
		width:
			(categories?.find((category) => category.id === activeCategory)?.title?.length || 11) *
				8 +
			64,
	});

	const { extensionSettings } = useExtensionSettings();

	useEffect(() => {
		if (extensionSettings?.defaultCategory && !activeCategory) {
			setActiveCategory(extensionSettings.defaultCategory);
		}
	}, [extensionSettings, activeCategory]);

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
							wrapper: classes.selectInput,
							dropdown: classes.selectDropdown,
							item: classes.selectItem,
						}}
						allowDeselect
						withinPortal={false}
						value={activeCategory}
						onChange={setActiveCategory}
						placeholder="No category"
					/>
				)}

				{(activeCategory && bookmarks.length > 0) ||
				(!activeCategory && uncategorizedBookmarks?.length > 0) ? (
					<Bookmarks bookmarks={activeCategory ? bookmarks : uncategorizedBookmarks} />
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
				<BookmarkForm
					mode="create"
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
