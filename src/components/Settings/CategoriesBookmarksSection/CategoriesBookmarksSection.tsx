import { useState } from 'react';
import { Accordion, Box, Modal, Text } from '@mantine/core';

import { useCategoriesBookmarksSectionStyles } from './CategoriesBookmarksSection.styles';

import { useExtensionSettings } from '@hooks/useExtensionSettings';
import { useExtensionCategories } from '@hooks/useExtensionCategories';
import { useExtensionBookmarks } from '@hooks/useExtensionBookmarks';

import { ModalRemoveCategory } from '@modals/ModalRemoveCategory';
import { ModalRemoveBookmark } from '@modals/ModalRemoveBookmark';
import { useModal } from '@hooks/useModal';

import { BookmarkForm, BookmarkValues } from '@forms/BookmarkForm';
import { CategoryForm, CategoryValues } from '@forms/CategoryForm';

import { CategoryRow } from '../CategoryRow';
import { BookmarkRow } from '../BookmarkRow';

type CategoriesAccordion = {
	openedCategory: string | null;
	categoryId: string | null;
};

export const CategoriesBookmarksSection = () => {
	const { extensionSettings } = useExtensionSettings();

	const { classes } = useCategoriesBookmarksSectionStyles();

	const [categoriesAccordion, setCategoriesAccordion] = useState<CategoriesAccordion>({
		openedCategory: null,
		categoryId: null,
	});

	const { categories, editCategory, removeCategory } = useExtensionCategories();
	const { bookmarks, editBookmark, uncategorizedBookmarks, removeBookmark } =
		useExtensionBookmarks({
			categoryId: categoriesAccordion?.categoryId,
		});

	const editCategoryModal = useModal();
	const removeCategoryModal = useModal();

	const editBookmarkModal = useModal();
	const removeBookmarkModal = useModal();

	return (
		<>
			<Box>
				<Accordion
					chevronSize={18}
					chevronPosition="right"
					value={categoriesAccordion?.openedCategory}
					onChange={(value) => {
						const categoryId = value?.split('__').slice(-1)[0] || null;

						setCategoriesAccordion((prevState) => ({
							...prevState,
							openedCategory: value,
							categoryId: categoryId?.length === 0 ? null : categoryId,
						}));
					}}
					transitionDuration={400}
					variant="separated"
					classNames={{
						item: classes.categoriesAccordionItem,
						control: classes.categoriesAccordionControl,
						content: classes.categoriesAccordionContent,
						chevron: classes.categoriesAccordionChevron,
					}}
				>
					{categories.map(({ title, id: categoryId }) => (
						<Accordion.Item
							value={`category__${title}__${categoryId}`}
							key={`category__${title}__${categoryId}`}
						>
							<Accordion.Control>
								<CategoryRow
									name={title}
									key={categoryId}
									onEditAction={() =>
										editCategoryModal.open({
											categoryData: {
												id: categoryId,
												categoryName:
													categories?.find(
														(category) => category.id === categoryId,
													)?.title || '',
												defaultCategory:
													categoryId ===
													extensionSettings?.defaultCategory,
											},
										})
									}
									onRemoveAction={() =>
										removeCategoryModal.open({
											id: categoryId,
										})
									}
								/>
							</Accordion.Control>

							<Accordion.Panel>
								{bookmarks?.length > 0 ? (
									bookmarks?.map(({ title, id }) => (
										<BookmarkRow
											key={id}
											name={title}
											onEditAction={() => {
												const selectedBookmark = bookmarks?.find(
													(bookmark) => bookmark.id === id,
												);

												editBookmarkModal.open({
													bookmarkData: {
														id: id,
														bookmarkName: selectedBookmark?.title || '',
														bookmarkUrl: selectedBookmark?.url || '',
														bookmarkCategoryId:
															selectedBookmark?.parentId || '',
													},
												});
											}}
											onRemoveAction={() =>
												removeBookmarkModal.open({
													id: id,
												})
											}
										/>
									))
								) : (
									<Text size="sm">No bookmarks for this cateogry</Text>
								)}
							</Accordion.Panel>
						</Accordion.Item>
					))}

					<Accordion.Item
						key="uncategorized__simplestart__bookmarks"
						value="category__uncategorized__"
					>
						<Accordion.Control>Uncategorized bookmarks</Accordion.Control>

						<Accordion.Panel>
							{uncategorizedBookmarks?.length > 0 ? (
								uncategorizedBookmarks?.map(({ title, id }) => (
									<BookmarkRow
										key={id}
										name={title}
										onEditAction={() => {
											const selectedBookmark = uncategorizedBookmarks?.find(
												(bookmark) => bookmark.id === id,
											);

											editBookmarkModal.open({
												bookmarkData: {
													id: id,
													bookmarkName: selectedBookmark?.title || '',
													bookmarkUrl: selectedBookmark?.url || '',
												},
											});
										}}
										onRemoveAction={() =>
											removeBookmarkModal.open({
												id: id,
											})
										}
									/>
								))
							) : (
								<Text size="sm">No bookmarks for this cateogry</Text>
							)}
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
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
						editCategoryModal?.args?.categoryData as CategoryValues | undefined
					}
					editCategory={editCategory}
				/>
			</Modal>

			<Modal
				opened={editBookmarkModal?.isOpen}
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
						editBookmarkModal?.args?.bookmarkData as BookmarkValues | undefined
					}
					editBookmark={editBookmark}
				/>
			</Modal>

			<ModalRemoveCategory
				onClose={removeCategoryModal.close}
				opened={removeCategoryModal.isOpen}
				id={removeCategoryModal?.args?.id as string}
				name={
					categories?.find((category) => category.id === removeCategoryModal?.args?.id)
						?.title
				}
				removeCategory={removeCategory}
			/>

			<ModalRemoveBookmark
				onClose={removeBookmarkModal.close}
				opened={removeBookmarkModal.isOpen}
				id={removeBookmarkModal?.args?.id as string}
				name={
					bookmarks?.find((bookmark) => bookmark.id === removeBookmarkModal?.args?.id)
						?.title
				}
				removeBookmark={removeBookmark}
			/>
		</>
	);
};
