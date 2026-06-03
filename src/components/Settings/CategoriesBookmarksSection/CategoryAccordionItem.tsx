import { Accordion, Box, Text } from '@mantine/core';
import { Draggable, Droppable } from '@hello-pangea/dnd';

import { type ExtensionCategoryTreeNode } from '@/types/browserExtend';
import { CategoryRow } from '@/components/Settings/CategoryRow';

import { BookmarkDragItem } from './BookmarkDragItem';

type CategoryAccordionItemProps = {
	category: ExtensionCategoryTreeNode;
	categoryIndex: number;
	isDefaultCategory: boolean;
	onEditCategory: (categoryData: {
		id: string;
		categoryName: string;
		defaultCategory: boolean;
	}) => void;
	onRemoveCategory: (categoryData: { id: string; categoryName: string }) => void;
	onEditBookmark: (bookmarkData: {
		id: string;
		bookmarkName: string;
		bookmarkUrl: string;
		bookmarkCategoryId: string;
	}) => void;
	onRemoveBookmark: (bookmarkData: { id: string; title: string }) => void;
};

export const CategoryAccordionItem = ({
	category,
	categoryIndex,
	isDefaultCategory,
	onEditCategory,
	onRemoveCategory,
	onEditBookmark,
	onRemoveBookmark,
}: CategoryAccordionItemProps) => {
	const categoryAccordionValue = `category__${category.title}__${category.id}`;
	return (
		<Accordion.Item value={categoryAccordionValue}>
			<Draggable draggableId={category.id} index={categoryIndex}>
				{(provided, snapshot) => (
					<Box
						ref={provided.innerRef}
						sx={(theme) => ({
							borderColor: snapshot.isDragging
								? `${theme.colors.background[3]} !important`
								: undefined,
							borderStyle: 'solid',
							borderWidth: snapshot.isDragging ? 1 : 0,
						})}
						{...provided.draggableProps}
					>
						<Accordion.Control
							sx={(theme) => ({
								padding: '8px 16px',
								backgroundColor: snapshot.isDragging
									? `${theme.colors.background[2]} !important`
									: undefined,
							})}
						>
							<CategoryRow
								name={category.title}
								onEditAction={() => {
									onEditCategory({
										id: category.id,
										categoryName: category.title || '',
										defaultCategory: isDefaultCategory,
									});
								}}
								onRemoveAction={() => {
									onRemoveCategory({
										id: category.id,
										categoryName: category.title || '',
									});
								}}
								{...provided.dragHandleProps}
							/>
						</Accordion.Control>

						<Accordion.Panel>
							<Droppable droppableId={category.id} type="bookmark">
								{(bookmarkDroppableProvided) => (
									<>
										<div
											ref={bookmarkDroppableProvided.innerRef}
											{...bookmarkDroppableProvided.droppableProps}
										>
											{category.bookmarks.length > 0 ? (
												category.bookmarks.map((bookmark, index) => (
													<BookmarkDragItem
														key={bookmark.id}
														title={bookmark.title}
														id={bookmark.id}
														bookmarkIndex={index}
														onEditAction={() => {
															onEditBookmark({
																id: bookmark.id,
																bookmarkName: bookmark.title || '',
																bookmarkUrl: bookmark.url || '',
																bookmarkCategoryId: category.id,
															});
														}}
														onRemoveAction={() => {
															onRemoveBookmark({
																id: bookmark.id,
																title: bookmark.title,
															});
														}}
													/>
												))
											) : (
												<Text size="sm" p={16}>
													No bookmarks for this category
												</Text>
											)}
										</div>

										{bookmarkDroppableProvided.placeholder}
									</>
								)}
							</Droppable>
						</Accordion.Panel>
					</Box>
				)}
			</Draggable>
		</Accordion.Item>
	);
};
