import { useState } from 'react';
import { Accordion, Box, Modal, Text } from '@mantine/core';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

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
import { useExtensionRoot } from '@hooks/useExtensionRoot';

type CategoriesAccordion = {
	openedCategory: string | null;
	categoryId: string | null;
};

// TODO: This file needs to be cleaned up at some point at it just got out of hand. It's a mess. It should be split into smaller components.
const BookmarkDragItem = ({
	title,
	id,
	bookmarkIndex,
	onEditAction,
	onRemoveAction,
}: {
	title: string;
	id: string;
	bookmarkIndex: number;
	onEditAction: () => void;
	onRemoveAction: () => void;
}) => {
	return (
		<Draggable key={id} index={bookmarkIndex} draggableId={id}>
			{(bookmarkProvided, snapshot) => (
				<div
					{...bookmarkProvided.draggableProps}
					{...bookmarkProvided.dragHandleProps}
					ref={bookmarkProvided.innerRef}
				>
					<BookmarkRow
						key={`${id}`}
						name={title}
						onEditAction={onEditAction}
						onRemoveAction={onRemoveAction}
						isBeingMoved={snapshot.isDragging}
					/>
				</div>
			)}
		</Draggable>
	);
};

export const CategoriesBookmarksSection = () => {
	const { classes } = useCategoriesBookmarksSectionStyles();

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
			categoryId: categoriesAccordion?.categoryId,
		});

	const { extensionTree } = useExtensionRoot();

	const handleItemDrag = async (result: DropResult) => {
		if (!result?.destination) {
			return;
		}

		// Moving categories
		if (result?.type === 'category') {
			await moveCategory(result.draggableId, result.source.index, result.destination.index);
		}

		// Moving bookmarks
		if (result?.type === 'bookmark' || result?.type === 'uncategorizedBookmark') {
			// Making sure that the bookmark is moved to the same category
			if (result?.destination?.droppableId !== result?.source?.droppableId) {
				return;
			}

			await moveBookmark(
				result.draggableId,
				result.source.index,
				result.destination.index,
				result?.type === 'uncategorizedBookmark',
			);
		}
	};

	return (
		<>
			<Box>
				<DragDropContext onDragEnd={handleItemDrag}>
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
						<Droppable droppableId="droppable" type="category">
							{(categoriesProvided) => (
								<Box
									ref={categoriesProvided.innerRef}
									{...categoriesProvided.droppableProps}
								>
									{(extensionTree || []).map((category, index) => (
										<Accordion.Item
											value={`category__${category.title}__${category.id}`}
											key={`category__${category.title}__${category.id}`}
										>
											<Draggable
												key={category.id}
												draggableId={category.id}
												index={index}
											>
												{(provided, snapshot) => (
													<>
														<Box
															ref={provided.innerRef}
															sx={(theme) => ({
																borderColor: snapshot.isDragging
																	? `${theme.colors.background[3]} !important`
																	: undefined,
																borderStyle: 'solid',
																borderWidth: snapshot.isDragging
																	? 1
																	: 0,
															})}
															{...provided.draggableProps}
														>
															<Accordion.Control
																sx={(theme) => ({
																	padding: '8px 16px',
																	backgroundColor:
																		snapshot.isDragging
																			? `${theme.colors.background[2]} !important`
																			: undefined,
																})}
															>
																<CategoryRow
																	name={category.title}
																	onEditAction={() => {
																		editCategoryModal.open({
																			categoryData: {
																				id: category.id,
																				categoryName:
																					category.title ||
																					'',
																				defaultCategory:
																					category.id ===
																					extensionSettings?.defaultCategory,
																			},
																		});
																	}}
																	onRemoveAction={() =>
																		removeCategoryModal.open({
																			id: category.id,
																			categoryName:
																				category.title ||
																				'',
																		})
																	}
																	{...provided.dragHandleProps}
																/>
															</Accordion.Control>

															<Accordion.Panel>
																<Droppable
																	droppableId={category.id}
																	type="bookmark"
																>
																	{(provided) => (
																		<>
																			<div
																				ref={
																					provided.innerRef
																				}
																				{...provided.droppableProps}
																			>
																				{category?.bookmarks
																					?.length > 0 ? (
																					category.bookmarks?.map(
																						(
																							bookmark,
																							index,
																						) => (
																							<BookmarkDragItem
																								title={
																									bookmark.title
																								}
																								id={
																									bookmark.id
																								}
																								bookmarkIndex={
																									index
																								}
																								onEditAction={() => {
																									editBookmarkModal.open(
																										{
																											bookmarkData:
																												{
																													id: bookmark.id,
																													bookmarkName:
																														bookmark?.title ||
																														'',
																													bookmarkUrl:
																														bookmark?.url ||
																														'',
																													bookmarkCategoryId:
																														category?.id ||
																														'',
																												},
																										},
																									);
																								}}
																								onRemoveAction={() =>
																									removeBookmarkModal.open(
																										{
																											id: bookmark.id,
																											title: bookmark.title,
																										},
																									)
																								}
																							/>
																						),
																					)
																				) : (
																					<Text
																						size="sm"
																						p={16}
																					>
																						No bookmarks
																						for this
																						category
																					</Text>
																				)}
																			</div>
																			{provided.placeholder}
																		</>
																	)}
																</Droppable>
															</Accordion.Panel>
														</Box>
													</>
												)}
											</Draggable>
										</Accordion.Item>
									))}
									{categoriesProvided.placeholder}

									<Accordion.Item
										key="uncategorized__simplestart__bookmarks"
										value="category__uncategorized__"
									>
										<Accordion.Control>
											<Text sx={{ height: 28 }}>Uncategorized bookmarks</Text>
										</Accordion.Control>

										<Accordion.Panel>
											<Droppable
												droppableId="uncategorized"
												type="uncategorizedBookmark"
											>
												{(provided) => (
													<>
														<div
															ref={provided.innerRef}
															{...provided.droppableProps}
														>
															{uncategorizedBookmarks?.length > 0 ? (
																uncategorizedBookmarks?.map(
																	({ title, id, url }, index) => (
																		<BookmarkDragItem
																			bookmarkIndex={index}
																			id={id}
																			title={title}
																			onEditAction={() => {
																				editBookmarkModal.open(
																					{
																						bookmarkData:
																							{
																								id: id,
																								bookmarkName:
																									title ||
																									'',
																								bookmarkUrl:
																									url ||
																									'',
																							},
																					},
																				);
																			}}
																			onRemoveAction={() =>
																				removeBookmarkModal.open(
																					{
																						id: id,
																						title: title,
																					},
																				)
																			}
																		/>
																	),
																)
															) : (
																<Text size="sm" p={16}>
																	No bookmarks for this category
																</Text>
															)}
														</div>
														{provided.placeholder}
													</>
												)}
											</Droppable>
										</Accordion.Panel>
									</Accordion.Item>
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
				name={removeCategoryModal?.args?.categoryName as string}
				removeCategory={removeCategory}
			/>

			<ModalRemoveBookmark
				onClose={removeBookmarkModal.close}
				opened={removeBookmarkModal.isOpen}
				id={removeBookmarkModal?.args?.id as string}
				name={removeBookmarkModal?.args?.title as string | undefined}
				removeBookmark={removeBookmark}
			/>
		</>
	);
};
