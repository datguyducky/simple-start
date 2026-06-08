import { useEffect, useMemo } from 'react';
import { useHotkeys } from '@mantine/hooks';
import { Text, Modal, Box, Select, Title } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { Bookmarks } from '@/components/Bookmarks';
import { NewTabHeader } from '@/components/NewTabHeader';
import { BookmarkForm } from '@/forms/BookmarkForm';
import { CategoryForm } from '@/forms/CategoryForm';
import { OPEN_BOOKMARK_SHORTCUTS } from '@/common/constants';
import { useExtensionBookmarks } from '@/hooks/useExtensionBookmarks';
import { useExtensionCategories } from '@/hooks/useExtensionCategories';
import { useExtensionSettings } from '@/hooks/useExtensionSettings';
import { useExtensionRoot } from '@/hooks/useExtensionRoot';
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

	const { extensionTree } = useExtensionRoot();
	const { extensionSettings } = useExtensionSettings();

	const firstTenBookmarks = useMemo(() => {
		let source: typeof uncategorizedBookmarks = [];

		if (extensionSettings.oneView) {
			const categorized = extensionTree?.flatMap((category) => category.bookmarks) ?? [];

			source = [...categorized, ...uncategorizedBookmarks];
		} else if (activeCategory) {
			source = bookmarks;
		} else {
			source = uncategorizedBookmarks;
		}

		const uniqueBookmarks = new Map(source.map((bookmark) => [bookmark.id, bookmark]));

		return Array.from(uniqueBookmarks.values()).slice(0, 10);
	}, [
		extensionSettings.oneView,
		activeCategory,
		extensionTree,
		bookmarks,
		uncategorizedBookmarks,
	]);

	useHotkeys(
		OPEN_BOOKMARK_SHORTCUTS.map((shortcut) => [
			shortcut.keys,
			() => {
				const bookmark = firstTenBookmarks[shortcut.bookmarkIndex];
				if (!bookmark.url) {
					return;
				}

				window.location.href = bookmark.url;
			},
		]),
	);

	const oneViewBookmarkGroups = useMemo(() => {
		const categoryGroups =
			extensionTree
				?.filter((category) => category.bookmarks.length > 0)
				.map((category) => ({
					id: category.id,
					title: category.title,
					bookmarks: category.bookmarks,
				})) ?? [];

		if (uncategorizedBookmarks.length <= 0) {
			return categoryGroups;
		}

		return [
			...categoryGroups,
			{
				id: 'uncategorized',
				title: 'Uncategorized',
				bookmarks: uncategorizedBookmarks,
			},
		];
	}, [extensionTree, uncategorizedBookmarks]);

	const displayedBookmarks = activeCategory ? bookmarks : uncategorizedBookmarks;
	const shouldDisplayBookmarks = displayedBookmarks.length > 0;
	const shouldDisplayEmptyCategoryMessage = !shouldDisplayBookmarks && categories.length > 0;

	// todo: this is still far from being perfect, so it would be a good idea to find even better approach for this
	const categoryLength =
		categories.find((category) => category.id === activeCategory)?.title.replace(' ', '')
			.length || 11;
	const customWidth = categoryLength > 40 ? categoryLength * 7.5 : categoryLength * 8 + 64;

	useEffect(() => {
		if (extensionSettings.defaultCategory && activeCategory === undefined) {
			setActiveCategory(extensionSettings.defaultCategory);
		}
	}, [extensionSettings, activeCategory]);

	return (
		<>
			<Box className={classes.newTabLayout}>
				<NewTabHeader
					onNewBookmarkClick={() => {
						newCategoryModal.close();
						newBookmarkModal.open();
					}}
					onNewCategoryClick={() => {
						newBookmarkModal.close();
						newCategoryModal.open();
					}}
				/>

				{categories.length <= 0 && uncategorizedBookmarks.length <= 0 && (
					<Text c="dimmed">
						{'Click "add" button to add your first bookmark and category to this view.'}
					</Text>
				)}

				{!extensionSettings.oneView && categories.length > 0 && (
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

				{extensionSettings.oneView ? (
					<>
						{oneViewBookmarkGroups.map((group) => (
							<Box key={group.id} mb={extensionSettings.oneViewCategoriesGap}>
								<Box
									className={classes.oneViewCategoryHeadingContainer}
									mb={extensionSettings.oneViewHeadingGap}
								>
									<Title order={4} className={classes.oneViewCategoryHeading}>
										{group.title}
									</Title>
									<Box className={classes.oneViewCategoryHeadingLine} />
								</Box>
								<Bookmarks bookmarks={group.bookmarks} />
							</Box>
						))}
					</>
				) : shouldDisplayBookmarks ? (
					<Bookmarks bookmarks={displayedBookmarks} />
				) : shouldDisplayEmptyCategoryMessage ? (
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
				zIndex={1000}
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
				zIndex={1000}
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
