import { Accordion, Text } from '@mantine/core';
import { Droppable } from '@hello-pangea/dnd';

import { type BookmarkTreeNode } from '@/types/browserExtend';

import { BookmarkDragItem } from './BookmarkDragItem';

type UncategorizedBookmarksAccordionItemProps = {
	bookmarks: BookmarkTreeNode[];
	onEditBookmark: (bookmarkData: {
		id: string;
		bookmarkName: string;
		bookmarkUrl: string;
	}) => void;
	onRemoveBookmark: (bookmarkData: { id: string; title: string }) => void;
};

export const UncategorizedBookmarksAccordionItem = ({
	bookmarks,
	onEditBookmark,
	onRemoveBookmark,
}: UncategorizedBookmarksAccordionItemProps) => {
	return (
		<Accordion.Item value="category__uncategorized__">
			<Accordion.Control>
				<Text sx={{ height: 28 }}>Uncategorized bookmarks</Text>
			</Accordion.Control>

			<Accordion.Panel>
				<Droppable droppableId="uncategorized" type="uncategorizedBookmark">
					{(provided) => (
						<>
							<div ref={provided.innerRef} {...provided.droppableProps}>
								{bookmarks.length > 0 ? (
									bookmarks.map(({ title, id, url }, index) => (
										<BookmarkDragItem
											key={id}
											bookmarkIndex={index}
											id={id}
											title={title}
											onEditAction={() => {
												onEditBookmark({
													id,
													bookmarkName: title || '',
													bookmarkUrl: url || '',
												});
											}}
											onRemoveAction={() => {
												onRemoveBookmark({
													id,
													title,
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

							{provided.placeholder}
						</>
					)}
				</Droppable>
			</Accordion.Panel>
		</Accordion.Item>
	);
};
