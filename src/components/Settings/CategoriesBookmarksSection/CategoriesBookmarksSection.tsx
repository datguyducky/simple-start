import { useState } from 'react';
import { Accordion, Box, Modal, Text } from '@mantine/core';

import { useCategoriesBookmarksSectionStyles } from './CategoriesBookmarksSection.styles';

import { useExtensionSettings } from '@hooks/useExtensionSettings';
import { useExtensionCategories } from '@hooks/useExtensionCategories';
import { useExtensionBookmarks } from '@hooks/useExtensionBookmarks';

import { ModalRemoveCategory } from '@modals/ModalRemoveCategory';
import { ModalRemoveBookmark } from '@modals/ModalRemoveBookmark';

import { BookmarkForm } from '@forms/BookmarkForm';
import { CategoryForm } from '@forms/CategoryForm';

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

	const [editCategoryModal, setEditCategoryModal] = useState({
		isVisible: false,
		categoryData: {
			id: '',
			categoryName: '',
			defaultCategory: false,
		},
	});
	const [removeCategoryModal, setRemoveCategoryModal] = useState({
		isVisible: false,
		id: '',
	});

	const [editBookmarkModal, setEditBookmarkModal] = useState<{
		isVisible: boolean;
		bookmarkData: {
			id: string;
			bookmarkName: string;
			bookmarkUrl: string;
			bookmarkCategoryId?: string;
			prevBookmarkCategoryId?: string;
		};
	}>({
		isVisible: false,
		bookmarkData: {
			id: '',
			bookmarkName: '',
			bookmarkUrl: '',
			bookmarkCategoryId: '',
		},
	});
	const [removeBookmarkModal, setRemoveBookmarkModal] = useState({
		isVisible: false,
		id: '',
	});

	function onCloseEditBookmarkModal() {
		setEditBookmarkModal((prevEditBookmarkModal) => ({
			...prevEditBookmarkModal,
			isVisible: false,
		}));
	}

	function onCloseEditCategoryModal() {
		setEditCategoryModal((prevEditCategoryModal) => ({
			...prevEditCategoryModal,
			isVisible: false,
		}));
	}

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
										setEditCategoryModal((prevEditCategoryModal) => ({
											...prevEditCategoryModal,
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
											isVisible: true,
										}))
									}
									onRemoveAction={() =>
										setRemoveCategoryModal((prevRemoveCategoryModal) => ({
											...prevRemoveCategoryModal,
											isVisible: true,
											id: categoryId,
										}))
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

												setEditBookmarkModal((prevEditBookmarkModal) => ({
													...prevEditBookmarkModal,
													bookmarkData: {
														id: id,
														bookmarkName: selectedBookmark?.title || '',
														bookmarkUrl: selectedBookmark?.url || '',
														bookmarkCategoryId:
															selectedBookmark?.parentId || '',
													},
													isVisible: true,
												}));
											}}
											onRemoveAction={() =>
												setRemoveBookmarkModal({
													isVisible: true,
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

											setEditBookmarkModal((prevEditBookmarkModal) => ({
												...prevEditBookmarkModal,
												bookmarkData: {
													id: id,
													bookmarkName: selectedBookmark?.title || '',
													bookmarkUrl: selectedBookmark?.url || '',
												},
												isVisible: true,
											}));
										}}
										onRemoveAction={() =>
											setRemoveBookmarkModal({
												isVisible: true,
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
				opened={editCategoryModal?.isVisible}
				onClose={onCloseEditCategoryModal}
				centered
				title="Edit category"
				size="lg"
			>
				<CategoryForm
					mode="edit"
					onClose={onCloseEditCategoryModal}
					initialValues={editCategoryModal?.categoryData}
					editCategory={editCategory}
				/>
			</Modal>

			<Modal
				opened={editBookmarkModal?.isVisible}
				onClose={onCloseEditBookmarkModal}
				centered
				title="Edit bookmark"
				size="lg"
			>
				<BookmarkForm
					mode="edit"
					onClose={() => {
						onCloseEditBookmarkModal();

						setCategoriesAccordion({
							categoryId: null,
							openedCategory: null,
						});
					}}
					initialValues={editBookmarkModal?.bookmarkData}
					editBookmark={editBookmark}
				/>
			</Modal>

			<ModalRemoveCategory
				setRemoveCategoryModal={setRemoveCategoryModal}
				opened={removeCategoryModal.isVisible}
				id={removeCategoryModal.id}
				name={
					categories?.find((category) => category.id === removeCategoryModal?.id)?.title
				}
				removeCategory={removeCategory}
			/>

			<ModalRemoveBookmark
				onClose={() => setRemoveBookmarkModal({ isVisible: false, id: '' })}
				opened={removeBookmarkModal.isVisible}
				id={removeBookmarkModal.id}
				name={bookmarks?.find((bookmark) => bookmark.id === removeBookmarkModal?.id)?.title}
				removeBookmark={removeBookmark}
			/>
		</>
	);
};
