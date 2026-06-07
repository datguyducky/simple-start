import { useEffect } from 'react';
import { Text, Modal, Box, Select } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { Bookmarks } from '@/components/Bookmarks';
import { NewTabHeader } from '@/components/NewTabHeader';
import { BookmarkForm } from '@/forms/BookmarkForm';
import { CategoryForm } from '@/forms/CategoryForm';
import { useExtensionBookmarks } from '@/hooks/useExtensionBookmarks';
import { useExtensionCategories } from '@/hooks/useExtensionCategories';
import { useExtensionSettings } from '@/hooks/useExtensionSettings';
import { useModal } from '@/hooks/useModal';

import classes from './NewTab.module.css';

export const NewTab = () => {
	const newBookmarkModal = useModal();
	const newCategoryModal = useModal();

	const { activeCategory, setActiveCategory, categories, createCategory } =
		useExtensionCategories();

	const { bookmarks, uncategorizedBookmarks, createBookmark } = useExtensionBookmarks({
		categoryId: activeCategory,
	});

	// todo: this is still far from being perfect, so it would be a good idea to find even better approach for this
	const categoryLength =
		categories.find((category) => category.id === activeCategory)?.title.replace(' ', '')
			.length || 11;
	const customWidth = categoryLength > 40 ? categoryLength * 7.5 : categoryLength * 8 + 64;

	const { extensionSettings } = useExtensionSettings();
	useEffect(() => {
		if (extensionSettings.defaultCategory && activeCategory === undefined) {
			setActiveCategory(extensionSettings.defaultCategory);
		}
	}, [extensionSettings, activeCategory]);

	return (
		<>
			<Box className={classes.newTabLayout}>
				<NewTabHeader
					onNewBookmarkClick={newBookmarkModal.open}
					onNewCategoryClick={newCategoryModal.open}
				/>

				{categories.length <= 0 && uncategorizedBookmarks.length <= 0 && (
					<Text c="dimmed">
						{'Click "add" button to add your first bookmark and category to this view.'}
					</Text>
				)}

				{categories.length > 0 && (
					<Box pos="relative" component="span" mb={32}>
						<Select
							data={categories.map((category) => ({
								value: category.id,
								label: category.title,
							}))}
							rightSection={<IconChevronDown size={18} />}
							variant="unstyled"
							classNames={{
								wrapper: classes.selectInputWrapper,
								dropdown: classes.selectDropdown,
								option: classes.selectItem,
								input: classes.selectInput,
							}}
							styles={{
								root: {
									width: customWidth,
								},
							}}
							allowDeselect
							comboboxProps={{ withinPortal: false }}
							value={activeCategory}
							onChange={setActiveCategory}
							placeholder="No category"
							pos="relative"
						/>
					</Box>
				)}

				{(activeCategory && bookmarks.length > 0) ||
				(!activeCategory && uncategorizedBookmarks.length > 0) ? (
					<Bookmarks bookmarks={activeCategory ? bookmarks : uncategorizedBookmarks} />
				) : categories.length > 0 ? (
					<Text>
						{
							'Sorry, the currently selected category does not have any bookmarks. Click "add" button to create a new bookmark or category.'
						}
					</Text>
				) : (
					<></>
				)}
			</Box>

			<Modal
				opened={newBookmarkModal.isOpen}
				onClose={newBookmarkModal.close}
				centered
				title="Add new bookmark"
				size="lg"
			>
				<BookmarkForm
					mode="create"
					onClose={newBookmarkModal.close}
					createNewBookmark={createBookmark}
				/>
			</Modal>

			<Modal
				opened={newCategoryModal.isOpen}
				onClose={newCategoryModal.close}
				centered
				title="Add new category"
				size="lg"
			>
				<CategoryForm
					mode="create"
					onClose={newCategoryModal.close}
					createNewCategory={createCategory}
				/>
			</Modal>
		</>
	);
};
