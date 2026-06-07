import { useState } from 'react';
import { Accordion, Box, Modal } from '@mantine/core';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';

import classes from './CategoriesBookmarksSection.module.css';
import { CategoryAccordionItem } from './CategoryAccordionItem';
import { UncategorizedBookmarksAccordionItem } from './UncategorizedBookmarksAccordionItem';

import { useModal } from '@/hooks/useModal';
import { useExtensionSettings } from '@/hooks/useExtensionSettings';
import { useExtensionBookmarks } from '@/hooks/useExtensionBookmarks';
import { useExtensionRoot } from '@/hooks/useExtensionRoot';
import { useExtensionCategories } from '@/hooks/useExtensionCategories';
import { CategoryForm, type CategoryValues } from '@/forms/CategoryForm';
import { BookmarkForm, type BookmarkValues } from '@/forms/BookmarkForm';
import { ModalRemoveCategory } from '@/modals/ModalRemoveCategory';
import { ModalRemoveBookmark } from '@/modals/ModalRemoveBookmark';
import { handleAsyncAction } from '@/utils/handleAsyncAction';

type CategoriesAccordion = {
	openedCategory: string | null;
	categoryId: string | null;
};

export const CategoriesBookmarksSection = () => {
	const editCategoryModal = useModal();
	const removeCategoryModal = useModal();

	const editBookmarkModal = useModal();
	const removeBookmarkModal = useModal();

	const [categoriesAccordion, setCategoriesAccordion] = useState<CategoriesAccordion>({
		openedCategory: null,
		categoryId: null,
	});

	const { extensionSettings } = useExtensionSettings();

	const { editCategory, removeCategory, moveCategory } = useExtensionCategories();
	const { editBookmark, uncategorizedBookmarks, removeBookmark, moveBookmark } =
		useExtensionBookmarks({
			categoryId: categoriesAccordion.categoryId,
		});

	const { extensionTree } = useExtensionRoot();

	const handleItemDrag = async (result: DropResult) => {
		const { destination, draggableId, source, type } = result;

		if (!destination) {
			return;
		}

		if (type === 'category') {
			await moveCategory(draggableId, source.index, destination.index);
			return;
		}

		if (type !== 'bookmark' && type !== 'uncategorizedBookmark') {
			return;
		}

		// Moving bookmarks between categories is not supported here.
		if (destination.droppableId !== source.droppableId) {
			return;
		}

		await moveBookmark(
			draggableId,
			source.index,
			destination.index,
			type === 'uncategorizedBookmark',
		);
	};

	const handleDragEnd = (result: DropResult) => {
		handleAsyncAction(() => handleItemDrag(result), {
			errorTitle: 'Item could not be moved',
		});
	};

	return (
		<>
			<Box>
				<DragDropContext onDragEnd={handleDragEnd}>
					<Accordion
						chevronSize={18}
						chevronPosition="right"
						value={categoriesAccordion.openedCategory}
						onChange={(value) => {
							const categoryId = value?.split('__').slice(-1)[0] ?? null;

							setCategoriesAccordion((prevState) => ({
								...prevState,
								openedCategory: value,
								categoryId: categoryId && categoryId.length > 0 ? categoryId : null,
							}));
						}}
						transitionDuration={400}
						variant="separated"
						classNames={{
							item: classes.categoriesAccordionItem,
							control: classes.categoriesAccordionControl,
							content: classes.categoriesAccordionContent,
							chevron: classes.categoriesAccordionChevron,
							label: classes.categoriesAccordionLabel,
						}}
					>
						<Droppable droppableId="droppable" type="category">
							{(categoriesProvided) => (
								<Box
									ref={categoriesProvided.innerRef}
									{...categoriesProvided.droppableProps}
								>
									{(extensionTree ?? []).map((category, index) => (
										<CategoryAccordionItem
											key={category.id}
											category={category}
											categoryIndex={index}
											isDefaultCategory={
												category.id === extensionSettings.defaultCategory
											}
											onEditCategory={(categoryData) => {
												editCategoryModal.open({
													categoryData,
												});
											}}
											onRemoveCategory={(categoryData) => {
												removeCategoryModal.open({
													id: categoryData.id,
													categoryName: categoryData.categoryName,
												});
											}}
											onEditBookmark={(bookmarkData) => {
												editBookmarkModal.open({
													bookmarkData,
												});
											}}
											onRemoveBookmark={(bookmarkData) => {
												removeBookmarkModal.open({
													id: bookmarkData.id,
													title: bookmarkData.title,
												});
											}}
										/>
									))}

									{categoriesProvided.placeholder}

									<UncategorizedBookmarksAccordionItem
										bookmarks={uncategorizedBookmarks}
										onEditBookmark={(bookmarkData) => {
											editBookmarkModal.open({
												bookmarkData,
											});
										}}
										onRemoveBookmark={(bookmarkData) => {
											removeBookmarkModal.open({
												id: bookmarkData.id,
												title: bookmarkData.title,
											});
										}}
									/>
								</Box>
							)}
						</Droppable>
					</Accordion>
				</DragDropContext>
			</Box>

			<Modal
				opened={editCategoryModal.isOpen}
				onClose={editCategoryModal.close}
				centered
				title="Edit category"
				size="lg"
			>
				<CategoryForm
					mode="edit"
					onClose={editCategoryModal.close}
					initialValues={
						editCategoryModal.args?.categoryData as CategoryValues | undefined
					}
					editCategory={editCategory}
				/>
			</Modal>

			<Modal
				opened={editBookmarkModal.isOpen}
				onClose={editBookmarkModal.close}
				centered
				title="Edit bookmark"
				size="lg"
			>
				<BookmarkForm
					mode="edit"
					onClose={() => {
						editBookmarkModal.close();

						setCategoriesAccordion({
							categoryId: null,
							openedCategory: null,
						});
					}}
					initialValues={
						editBookmarkModal.args?.bookmarkData as BookmarkValues | undefined
					}
					editBookmark={editBookmark}
				/>
			</Modal>

			<ModalRemoveCategory
				onClose={removeCategoryModal.close}
				opened={removeCategoryModal.isOpen}
				id={removeCategoryModal.args?.id as string}
				name={removeCategoryModal.args?.categoryName as string}
				removeCategory={removeCategory}
			/>

			<ModalRemoveBookmark
				onClose={removeBookmarkModal.close}
				opened={removeBookmarkModal.isOpen}
				id={removeBookmarkModal.args?.id as string}
				name={removeBookmarkModal.args?.title as string | undefined}
				removeBookmark={removeBookmark}
			/>
		</>
	);
};
